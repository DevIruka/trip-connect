'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';

const CountryVerification = () => {
  const router = useRouter();
  const { user } = useUserStore(); 
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [locationDescription, setLocationDescription] = useState('');
  const [country, setCountry] = useState(''); 
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    if (!user?.id) {
      router.push('/login');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchLocationDetails(latitude, longitude);
      });
    }
  }, [user, router]);

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
    );
    const data = await response.json();

  if (data.status === 'OK') {
    const addressComponents: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }> = data.results[0]?.address_components || []; 

    const countryComponent = addressComponents.find((component) =>
      component.types.includes('country'),
    );
    const cityComponent = addressComponents.find((component) =>
      component.types.includes('locality'),
    );

    // 국가와 도시 정보 설정
    setCountry(countryComponent?.long_name || '알 수 없는 국가');
    setLocationDescription(
      `현재 위치가 내 국가로 설정한 ${
        countryComponent?.long_name || '알 수 없는 국가'
      } > ${cityComponent?.long_name || '알 수 없는 도시'}에 있습니다`,
    );
  }
  };

  const handleVerificationComplete = async () => {
    if (!user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ country_verified: true, country })
      .eq('id', user.id);

    if (error) {
      alert('인증 상태 업데이트 중 오류가 발생했습니다.');
      console.error(error);
      return;
    }

    alert('국가 인증이 완료되었습니다.');
    router.push('/mypage/seller-auth'); 
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;
  if (loadError) return <div>Error loading Google Maps</div>;

  return (
    <div className="min-h-screen px-5 py-4 bg-white">
      <button
        className="text-black text-lg font-medium mb-4"
        style={{ position: 'sticky', marginTop: '30px' }}
        onClick={() => router.back()}
      >
        ←
      </button>

      <h1 className="text-black text-xl font-semibold mb-6">국가 인증</h1>

      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        {userLocation.lat && userLocation.lng ? (
          <GoogleMap
            center={{ lat: userLocation.lat, lng: userLocation.lng }}
            zoom={14}
            mapContainerStyle={{ width: '100%', height: '100%' }}
          >
            <Marker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
            />
          </GoogleMap>
        ) : (
          <span className="text-gray-500">지도 로드 중...</span>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600">
        <strong>{locationDescription || '위치 확인 중...'}</strong>
      </p>

      <button
        className="mt-48 w-full py-3 bg-black text-white rounded-lg text-center text-lg font-medium"
        onClick={handleVerificationComplete}
        disabled={!locationDescription || !country} // 국가 정보가 없으면 버튼 비활성화
      >
        인증 완료하기
      </button>
    </div>
  );
};

export default CountryVerification;

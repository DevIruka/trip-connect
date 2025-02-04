'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useUserStore } from '@/store/userStore';
import BackButton from '@/app/post/_components/BackBtn';
import LocationText from '../_components/locationText';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useTranslation } from 'react-i18next'; 
import { useLang } from '@/store/languageStore';

const CountryVerification = () => {
  const { lang } = useLang();
  const { t } = useTranslation('mypage'); 
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
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=${lang}`,
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

      console.log('Detected Country:', countryComponent?.long_name);
      console.log('Detected City:', cityComponent?.long_name);

      // 국가와 도시 정보 설정
      setCountry(countryComponent?.long_name || t('unknown_country'));
      setLocationDescription(cityComponent?.long_name || t('unknown_city'));
    }
  };

  const handleVerificationComplete = async () => {
    if (!user?.id) {
      alert(t('login_required'));
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ country_verified: true, country })
      .eq('id', user.id);

    if (error) {
      alert(t('verification_error'));
      console.error(error);
      return;
    }

    router.push('/mypage/seller-auth?newlyVerified=true');
  };

  if (!isLoaded) return <div>{t('map_loading')}</div>;
  if (loadError) return <div>{t('map_error')}</div>;

  return (
    <div className="h-full w-full max-w-[872px] px-5 md:px-[36px] lg:px-[36px] mx-auto bg-white">
      {/* 헤더 섹션 */}
      <div className="h-14 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white md:h-[71px] md:mt-[40px] md:text-[32px] md:mb-[28px]">
        <div className="md:hidden">
          <BackButton />
        </div>
        <h1 className="text-center text-black text-lg font-semibold md:text-[32px] absolute left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:text-left  ">
          {t('country_verification')}
        </h1>
      </div>

      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mt-2 md:w-[800px] md:h-[400px]">
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
          <span className="text-gray-500">{t('map_loading')}</span>
        )}
      </div>

      <LocationText
        locationDescription={locationDescription}
        country={country}
      />

      <button
        className="bg-[#0582ff] mt-[161px] text-white text-sm font-semibold rounded-md w-full max-w-[800px] h-[52px] md:h-[64px] mx-auto mt-4 md:mt-16"
        onClick={handleVerificationComplete}
        disabled={!locationDescription || !country}
      >
        {t('complete_verification')}
      </button>
    </div>
  );
};

export default CountryVerification;

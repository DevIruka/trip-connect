'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const CountryVerification = () => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchCountry(latitude, longitude);
      });
    }
  }, []);

  const fetchCountry = async (latitude: number, longitude: number) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === 'OK') {
      const addressComponents: AddressComponent[] =
        data.results[0]?.address_components || [];
      const countryComponent = addressComponents.find((component) =>
        component.types.includes('country'),
      );
      setCountry(countryComponent?.long_name || '');
    }
  };

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
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${userLocation.lat},${userLocation.lng}&zoom=14`}
            allowFullScreen
          ></iframe>
        ) : (
          <span className="text-gray-500">지도 로드 중...</span>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-600">
        <strong>현재 위치</strong>: {country || '위치 확인 중...'}
      </p>

      <button
        className="mt-48 w-full py-3 bg-black text-white rounded-lg text-center text-lg font-medium"
        disabled={!country}
      >
        인증 완료하기
      </button>
    </div>
  );
};

export default CountryVerification;

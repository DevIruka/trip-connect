'use client';

import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: { name: string; address: string; lat: number; lng: number }) => void;
};

type GooglePlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

const GoogleModal: React.FC<Props> = ({ isOpen, onClose, onSelectLocation }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<GooglePlaceResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GooglePlaceResult | null>(null);

  const handleSearch = async () => {
    const apiUrl = `/api/response?query=${encodeURIComponent(search)}`;
    console.log('API 요청 URL:', apiUrl); // 디버깅용 로그

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data); // 디버깅용 로그

      if (data.results) {
        setResults(data.results);
      } else {
        console.error('검색 결과가 없습니다:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  const handleLocationSelect = (place: GooglePlaceResult) => {
    setSelectedLocation(place);
  };

  const handleLocationClick = () => {
    if (selectedLocation) {
      onSelectLocation({
        name: selectedLocation.name,
        address: selectedLocation.formatted_address,
        lat: selectedLocation.geometry.location.lat,
        lng: selectedLocation.geometry.location.lng,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-4/5 max-w-lg rounded p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Google Maps</h2>
          <button onClick={onClose} className="text-red-500">X</button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="주소나 장소 검색"
          className="w-full p-2 border rounded my-4"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          검색
        </button>
        <div className="h-64 my-4">
          {results.map((place) => (
            <div
              key={place.place_id}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleLocationSelect(place)}
            >
              <p className="font-bold">{place.name}</p>
              <p className="text-sm text-gray-600">{place.formatted_address}</p>
            </div>
          ))}
        </div>
        <button
          onClick={handleLocationClick}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          위치 선택
        </button>
      </div>
    </div>
  );
};

export default GoogleModal;

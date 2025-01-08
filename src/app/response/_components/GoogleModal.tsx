'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
};

const GoogleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const handleSearch = async () => {
    //검색 기능이 들어가야 함
  };

  const handleLocationClick = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-4/5 max-w-lg rounded p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Google Maps</h2>
          <button onClick={onClose} className="text-red-500">
            X
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="주소나 장소 검색"
          className="w-full p-2 border rounded my-4"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          검색
        </button>
        <div className="h-64 my-4">
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          >
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 37.7749, lng: -122.4194 }}
              zoom={10}
            >
              {selectedLocation && (
                <Marker
                  position={{
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
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

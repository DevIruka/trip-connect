'use client';

import React from 'react';
import { Continent } from '../_types/form';

type Props = {
  isOpen: boolean;
  toggleModal: () => void;
  handleLocationSelect: (location: string) => void;
};

const continents:Continent[] = [
  { name: '아시아', cities: ['서울', '도쿄', '방콕', '싱가포르'] },
  { name: '유럽', cities: ['런던', '파리', '로마', '베를린'] },
  { name: '북미', cities: ['뉴욕', '로스앤젤레스', '토론토', '시애틀'] },
  { name: '오세아니아', cities: ['시드니', '멜버른', '오클랜드'] },
  { name: '기타', cities: ['두바이', '이스탄불', '모스크바'] },
];

const LocationModal: React.FC<Props> = ({ isOpen, toggleModal, handleLocationSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-bold mb-4">나라/도시 선택</h2>
        <div className="space-y-4">
          {continents.map(({ name, cities }) => (
            <div key={name}>
              <h3 className="font-semibold text-gray-700 mb-2">{name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    className="px-3 py-2 border rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleLocationSelect(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          onClick={toggleModal}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default LocationModal;

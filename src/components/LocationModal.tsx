'use client';

import { continents } from "@/data/continents";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  toggleModal: () => void;
  handleLocationSelect: (location: string) => void;
};

const LocationModal: React.FC<Props> = ({
  isOpen,
  toggleModal,
  handleLocationSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredContinents = continents
    .map(({ name, cities }) => ({
      name,
      cities: cities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter(({ cities }) => cities.length > 0);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-end">
      <div className="bg-white rounded-t-lg shadow-lg w-full max-w-lg p-4">
        <div className="relative flex justify-center items-center mb-4">
          <button
            onClick={toggleModal}
            className="absolute left-0 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold">나라/도시 선택</h2>
        </div>

        {/* 검색 바 */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="나라/도시 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring pr-10"
          />
          <FaSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            style={{ color: 'black' }}
            size={16}
          />
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {filteredContinents.map(({ name, cities }) => (
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
      </div>
    </div>
  );
};

export default LocationModal;

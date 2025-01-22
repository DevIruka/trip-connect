import React, { useState } from 'react';
import LocationIcon from '../_icons/LocationIcon';

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

const GoogleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<GooglePlaceResult[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<GooglePlaceResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(false);
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
        setResults([]);
      }
    } catch (error) {
      console.error('검색 실패:', error);
      setResults([]); // 에러 발생 시 빈 결과 처리
    } finally {
      setIsLoading(false);
      setHasSearched(true);
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
      <div className="w-[335px] h-[416px] px-5 py-2.5 bg-white rounded-2xl flex flex-col justify-between">
        {/* 헤더 */}
        <div className="flex flex-col justify-start gap-3">
          <div className="flex justify-between items-center py-2">
            <h2 className="text-[#757575] text-base font-semibold leading-snug">
              장소 추가하기
            </h2>
            <button onClick={onClose} className="text-[#757575] font-bold">
              ✕
            </button>
          </div>

          {/* 검색창 */}
          <div className="w-full justify-center items-center gap-2.5 flex">
            <div className="w-full h-11 pl-4 pr-2 py-3.5 bg-white rounded-xl border border-[#DFE1E5] justify-center items-center gap-2.5 inline-flex">
              {/* 검색 입력 필드 */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="관광지/맛집/숙소 검색"
                className={`grow shrink basis-0 h-5 text-sm font-medium bg-transparent outline-none ${
                  search ? 'text-black' : 'text-[#797c80]'
                }`}
              />

              {/* 검색 버튼 */}
              <button
                onClick={handleSearch}
                className="px-3 py-1.5 bg-[#eaf4ff] rounded-md justify-center items-center flex"
              >
                <span className="text-[#0079f2] text-sm font-semibold">
                  검색
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 결과 영역 */}
        <div className="flex-grow pt-[12px] overflow-y-auto">
          {isLoading ? (
            <p className="text-[#797c80] text-sm font-semibold text-center mt-4">
              검색 중...
            </p>
          ) : hasSearched ? (
            results.length > 0 ? (
              results.map((place) => (
                <div
                  key={place.place_id}
                  className={`py-[12px] border-b border-[#f3f3f3] justify-start items-center gap-1.5 flex cursor-pointer hover:bg-gray-100 ${
                    selectedLocation?.place_id === place.place_id
                      ? 'bg-gray-100'
                      : ''
                  }`}
                  onClick={() => handleLocationSelect(place)}
                >
                  {/* 아이콘 영역 */}
                  <div className="flex items-start gap-[6px]">
                    <div className="w-[18px] h-[18px] flex justify-center items-center">
                      <LocationIcon />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="text-[#44484c] text-sm font-medium leading-tight">
                        {place.name}
                      </div>
                      <div className="text-[#a9a9a9] text-xs font-medium overflow-hidden break-words">
                        {place.formatted_address}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#797c80] text-sm font-semibold text-center mt-4">
                검색 결과가 없어요.
              </p>
            )
          ) : null}
        </div>

        {/* 하단 버튼 */}
        <div className="self-stretch py-2 flex justify-between items-center gap-2">
          <button
            onClick={onClose}
            className="w-[72px] h-12 px-3 py-1.5 rounded-xl border border-[#dee1e5] text-[#44484c] text-sm font-semibold"
          >
            취소
          </button>
          <button
            onClick={handleLocationClick}
            className="grow h-12 px-3 py-1.5 bg-[#0582ff] rounded-xl text-white text-sm font-semibold"
            disabled={!selectedLocation}
          >
            장소 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleModal;

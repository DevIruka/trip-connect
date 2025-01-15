import { useState } from 'react';

// 모달 컴포넌트
export const Modal = ({ isOpen, onClose, setCountry }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const countries = [
    '대한민국',
    '미국',
    '일본',
    '중국',
    '독일',
    '영국',
    '프랑스',
    '캐나다',
    '호주',
    '브라질',
  ];

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음
  // 검색어 상태

  // 검색어에 따라 도시 필터링
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-black bg-opacity-50"
      onClick={onClose} // 뒷배경 클릭 시 모달 닫기
    >
      <div
        className="bg-white w-full rounded-lg shadow-lg p-5 grid gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex place-content-between text-lg font-bold">
          <h2>나라 선택하기</h2>
          <button onClick={onClose}>X</button>
        </div>

        {/* 검색창 */}
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
        />

        {/* 필터링된 나라 목록 */}
        <ul className="max-h-60 overflow-auto border rounded-lg">
          {filteredCountries.map((country) => (
            <li
              key={country}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setCountry(country);
                onClose();
              }}
            >
              {country}
            </li>
          ))}
          {filteredCountries.length === 0 && (
            <li className="p-2 text-gray-500">검색 결과가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

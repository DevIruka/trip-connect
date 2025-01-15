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
      className="w-[375px] max-w-[100vw] h-screen mx-auto flex justify-center overflow-hidden fixed inset-0 z-20 items-end bg-black bg-opacity-50"
      onClick={onClose} // 뒷배경 클릭 시 모달 닫기
    >
      <div
        className="bg-white w-full rounded-lg shadow-lg p-5 grid gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex place-content-between text-lg font-bold">
          <button
            onClick={onClose}
            className="w-16 flex justify-start items-center"
          >
            X
          </button>
          <h2 className="flex justify-start items-center">나라/도시 선택</h2>
          <button
            onClick={onClose}
            className="bg-blue-600 py-2 w-16 rounded-md text-white"
          >
            선택
          </button>
        </div>

        {/* 검색창 */}
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault(); // 기본 폼 제출 동작 방지
          }}
        >
          <input
            type="text"
            className="w-full p-2 bg-gray-300 rounded-lg pr-10" // 오른쪽 여백 추가 (버튼 겹침 방지)
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
          />
          <button
            type="submit" // 폼 제출 버튼으로 설정
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md text-white hover:bg-gray-500"
          >
            🔍
          </button>
        </form>

        {/* 필터링된 나라 목록 */}
        <ul className="max-h-60 overflow-auto border rounded-lg">
          {filteredCountries.map((country) => (
            <li
              key={country}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setCountry(country);
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

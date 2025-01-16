import { useState } from 'react';
import { nations } from '../_constants/nation';
import { nation } from '../_types/homeTypes';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setCountry: (country: nation) => void;
};

type nationProps = {
  continent: string;
  country: string;
  cities: string[];
};

// 모달 컴포넌트
export const Modal = ({ isOpen, onClose, setCountry }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<nationProps[] | []>(
    [],
  );
  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  // 검색 입력 변경 처리
  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      // 검색어를 기반으로 필터링
      const results: nationProps[] = [];
      nations.forEach((continent) => {
        continent.countries.forEach((country) => {
          if (country.name.toLowerCase().includes(value.toLowerCase())) {
            results.push({
              continent: continent.continent,
              country: country.name,
              cities: country.cities,
            });
          } else if (
            country.cities.some((city) =>
              city.toLowerCase().includes(value.toLowerCase()),
            )
          ) {
            results.push({
              continent: continent.continent,
              country: country.name,
              cities: country.cities.filter((city) =>
                city.toLowerCase().includes(value.toLowerCase()),
              ),
            });
          }
        });
      });
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  // 위치 선택
  const handleSelect = (
    continent: string,
    country: string,
    city: string,
  ): void => {
    const location = { continent, country, city };
    setCountry(location);
    sessionStorage.setItem('selectedLocation', JSON.stringify(location));
  };

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  return (
    <>
      <div
        className="w-[375px] h-screen mx-auto flex justify-center overflow-hidden fixed inset-0 z-20 items-end bg-black bg-opacity-50"
        onClick={onClose} // 뒷배경 클릭 시 모달 닫기
      >
        <div
          className="bg-white w-full h-[90%] rounded-lg shadow-lg p-5 grid gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex place-content-between text-lg font-bold h-10">
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
            className="relative w-full"
            onSubmit={(e) => {
              e.preventDefault(); // 기본 폼 제출 동작 방지
            }}
          >
            <input
              type="text"
              className="w-full p-2 bg-gray-300 rounded-lg pr-10" // 오른쪽 여백 추가 (버튼 겹침 방지)
              value={searchTerm}
              onChange={handleSearchChange} // 검색어 업데이트
            />
            <button
              type="submit" // 폼 제출 버튼으로 설정
              className="absolute flex items-center px-2 "
            >
              🔍
            </button>
          </form>

          <div className="overflow-y-scroll grid gap-10 place-content-start">
            {/* 필터링된 결과 */}
            {searchTerm ? (
              filteredResults.length > 0 ? (
                <ul>
                  {filteredResults.map((result, index) => (
                    <li key={index}>
                      <ul>
                        <li
                          onClick={() =>
                            handleSelect(result.continent, result.country, '')
                          }
                        >
                          {result.country}
                        </li>
                        {result.cities.map((city, idx) => (
                          <li
                            key={idx}
                            onClick={() =>
                              handleSelect(
                                result.continent,
                                result.country,
                                city,
                              )
                            }
                            style={{ cursor: 'pointer', color: 'blue' }}
                          >
                            {result.country + ', ' + city}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{`"${searchTerm}"에 대한 검색 결과가 없어요.`}</p>
              )
            ) : (
              // 대륙 > 나라 버튼 표시
              nations.map((continent, idx) => (
                <div key={idx}>
                  <div className="grid gap-5">
                    <h3 className="font-bold">{continent.continent}</h3>
                    <div className="flex flex-wrap gap-3">
                      {continent.countries.map((country) =>
                        country.cities.map((city, cityIndex) => (
                          <button
                            key={cityIndex}
                            onClick={() =>
                              handleSelect(
                                continent.continent,
                                country.name,
                                city,
                              )
                            }
                            className="px-3 rounded-md border-2 bg-white cursor-pointer"
                          >
                            {city}
                          </button>
                        )),
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

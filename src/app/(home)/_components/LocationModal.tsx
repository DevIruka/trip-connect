import { useState } from 'react';
const data = [
  {
    continent: '아시아',
    countries: [
      {
        name: '한국',
        cities: ['서울'],
      },
      {
        name: '일본',
        cities: ['도쿄'],
      },
      {
        name: '태국',
        cities: ['방콕'],
      },
      {
        name: '싱가포르',
        cities: ['싱가포르'],
      },
    ],
  },
  {
    continent: '유럽',
    countries: [
      {
        name: '영국',
        cities: ['런던'],
      },
      {
        name: '프랑스',
        cities: ['파리'],
      },
      {
        name: '이탈리아',
        cities: ['로마'],
      },
      {
        name: '독일',
        cities: ['베를린'],
      },
    ],
  },
  {
    continent: '북미',
    countries: [
      {
        name: '미국',
        cities: ['뉴욕', '로스앤젤레스', '시애틀'],
      },
      {
        name: '캐나다',
        cities: ['토론토'],
      },
    ],
  },
  {
    continent: '오세아니아',
    countries: [
      {
        name: '호주',
        cities: ['시드니', '멜버른'],
      },
      {
        name: '뉴질랜드',
        cities: ['오클랜드'],
      },
    ],
  },
  {
    continent: '기타',
    countries: [
      {
        name: '두바이',
        cities: ['두바이'],
      },
      {
        name: '튀르키예',
        cities: ['이스탄불'],
      },
      {
        name: '러시아',
        cities: ['모스크바'],
      },
    ],
  },
];
// 모달 컴포넌트
export const Modal = ({ isOpen, onClose, setCountry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  // 검색 입력 변경 처리
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      // 검색어를 기반으로 필터링
      const results = [];
      data.forEach((continent) => {
        continent.countries.forEach((country) => {
          if (
            country.name.toLowerCase().includes(value.toLowerCase()) ||
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
  const handleSelect = (continent, country, city) => {
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
            className="fixed top-40"
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-md text-white hover:bg-gray-500"
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
              data.map((continent, idx) => (
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

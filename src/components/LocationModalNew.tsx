import { useState } from 'react';
import { enNations, nations } from '../data/nation';
import { nation } from '../app/home/_types/homeTypes';
import close from '@/data/images/ic-Close.svg';
import search from '@/data/images/ic-Search.svg';
import radioBtn from '@/data/images/radio_btn.svg';
import radioBtnSlctd from '@/data/images/radio_btn_slctd.svg';
import location from '@/data/images/ic-location.svg';
import Image from 'next/image';
import { useLang } from '@/store/languageStore';
import { useTranslation } from 'react-i18next';
import { Desktop, Mobile } from './ui/Responsive';
import renderContinents from './renderContinents';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  setCountry: (country: nation | null) => void;
  selectedCountry?: nation | null;
};

type nationProps = {
  continent: string;
  country: string;
  cities: string[];
};

// 모달 컴포넌트
export const LocationModal = ({
  isOpen,
  onClose,
  setCountry,
  selectedCountry,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<nationProps[] | []>(
    [],
  );
  const [selectedValue, setSelectedValue] = useState(''); // 선택된 값 저장
  const [crntNation, setCrntNation] = useState<nation | null>();
  const { t } = useTranslation('location');
  const { lang } = useLang();

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  // 검색 입력 변경 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      // 검색어를 기반으로 필터링
      const results: nationProps[] = [];
      if (lang === 'en') {
        enNations.forEach((continent) => {
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
      } else {
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
      }
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  };

  // 위치 선택
  const handleSelect = (): void => {
    setCountry(crntNation!);
    setSelectedValue(JSON.stringify(crntNation));
    sessionStorage.setItem('selectedLocation', JSON.stringify(crntNation));
  };

  const handleDeselect = (): void => {
    setCrntNation(null);
    setCountry(null);
    sessionStorage.removeItem('selectedLocation');
  };

  const handleTempSelect = (
    continent: string,
    country: string,
    city: string,
  ): void => {
    const location = { continent, country, city };
    setCrntNation(location);
  };

  if (!isOpen) return null; // 모달이 열리지 않으면 렌더링하지 않음

  return (
    <>
      <div
        className="w-full h-screen flex justify-center fixed inset-y-0 z-[100] items-end bg-black bg-opacity-50 md:items-center md:p-0"
        onClick={onClose} // 뒷배경 클릭 시 모달 닫기
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div
          className="bg-white rounded-t-[20px] z-[52] w-full h-[90%] px-5 md:rounded-[20px] md:w-[686px] md:h-[726px] md:py-9 md:px-10 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Mobile>
            <div className="h-14 py-2.5 flex place-content-between items-center text-lg font-bold">
              <button
                onClick={onClose}
                className="w-12 flex justify-start items-center"
              >
                <Image
                  className=""
                  src={close}
                  alt={'close btn'}
                  width={24}
                  height={24}
                />
              </button>
              <h2 className="flex justify-start items-center text-center text-black text-lg font-semibold">
                {t('select_country_city')}
              </h2>
              <button
                onClick={() => {
                  onClose();
                  handleSelect();
                }}
                className="bg-[#0582FF] h-8 py-1.5 px-3 rounded-md text-white text-sm font-semibold"
                disabled={!crntNation}
              >
                {t('select')}
              </button>{' '}
            </div>
          </Mobile>
          <Desktop>
            <div className="text-[#757575] text-xl font-semibold leading-loose py-2">
              질문할 나라 또는 도시를 선택해주세요.
            </div>
          </Desktop>
          <div className="grid">
            {/* 검색창 */}
            <form
              className="relative my-2"
              onSubmit={(e) => {
                e.preventDefault(); // 기본 폼 제출 동작 방지
              }}
            >
              <input
                type="text"
                className="w-full h-11 px-4 py-3 bg-[#f9f9f9] rounded-lg placeholder:text-[#797c80] placeholder:text-sm placeholder:font-medium placeholder:leading-tight md:placeholder:text-lg md:h-14" // 오른쪽 여백 추가 (버튼 겹침 방지)
                value={searchTerm}
                onChange={handleSearchChange} // 검색어 업데이트
                placeholder={t('search_country_city')}
              />
              <button
                type="submit" // 폼 제출 버튼으로 설정
                className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center"
              >
                <Image src={search} alt={'search btn'} width={20} height={20} />
              </button>
            </form>

            {/* 현재 선택 국가, 선택 해제 */}
            {selectedCountry && (
              <div className="flex place-content-between my-1">
                <Mobile>
                  <div className="flex gap-1 items-center text-center text-[#0582ff] text-sm font-semibold">
                    <Image
                      src={location}
                      width={14}
                      height={14}
                      alt="location"
                    />
                    {`${selectedCountry.country}/${selectedCountry.city}`}
                  </div>
                  <button
                    className="h-[29px] px-3 py-1.5 bg-[#f4f6f9] rounded-[100px] justify-center items-center gap-2.5 inline-flex text-center text-[#44484c] text-xs font-medium leading-none"
                    onClick={handleDeselect}
                  >
                    {t('initialize')}
                  </button>
                </Mobile>
                <Desktop>
                  <div className="flex gap-1 items-center text-center text-[#0582ff] text-lg font-semibold">
                    <Image
                      src={location}
                      width={20}
                      height={20}
                      alt="location"
                    />
                    {`${selectedCountry.country}/${selectedCountry.city}`}
                  </div>
                  <button
                    className="h-[34px] px-3 py-1.5 bg-[#f4f6f9] rounded-[100px] justify-center items-center gap-2.5 inline-flex text-center text-[#44484c] text-base font-medium leading-none"
                    onClick={handleDeselect}
                  >
                    {t('initialize')}
                  </button>
                </Desktop>
              </div>
            )}

            <div className="overflow-y-auto menuscrollbar place-content-start mt-5 max-h-[60vh] md:grid md:grid-cols-2 md:my-9">
              {/* 필터링된 결과 */}
              {searchTerm ? (
                filteredResults.length > 0 ? (
                  <ul className="grid gap-3 text-[#44484c] text-sm font-medium leading-tight md:text-lg">
                    {filteredResults.map((result, index) => (
                      <li key={index}>
                        <ul className="grid gap-3">
                          <label
                            className={`flex gap-2 cursor-pointer ${
                              JSON.stringify(crntNation) ===
                              `{"continent":"${result.continent}","country":"${result.country}","city":""}`
                                ? 'text-black'
                                : ''
                            }`}
                          >
                            <Image
                              src={
                                JSON.stringify(crntNation) ===
                                `{"continent":"${result.continent}","country":"${result.country}","city":""}`
                                  ? radioBtnSlctd
                                  : radioBtn
                              }
                              alt={'radio btn'}
                              width={22}
                              height={22}
                            />
                            <input
                              className="hidden"
                              type="radio"
                              name="options"
                              value={selectedValue}
                              onChange={() =>
                                handleTempSelect(
                                  result.continent,
                                  result.country,
                                  '',
                                )
                              }
                            />
                            <li className="py-[9px] ">{result.country}</li>
                          </label>
                          {result.cities.map((city, idx) => (
                            <li key={idx} className="py-[9px] flex gap-2">
                              <label
                                className={`flex gap-2 cursor-pointer items-center ${
                                  JSON.stringify(crntNation) ===
                                  `{"continent":"${result.continent}","country":"${result.country}","city":"${city}"}`
                                    ? 'text-black'
                                    : ''
                                }`}
                              >
                                <Image
                                  src={
                                    JSON.stringify(crntNation) ===
                                    `{"continent":"${result.continent}","country":"${result.country}","city":"${city}"}`
                                      ? radioBtnSlctd
                                      : radioBtn
                                  }
                                  alt={'radio btn'}
                                  width={22}
                                  height={22}
                                />
                                <input
                                  className="hidden"
                                  type="radio"
                                  name="options"
                                  value={selectedValue}
                                  onChange={() =>
                                    handleTempSelect(
                                      result.continent,
                                      result.country,
                                      city,
                                    )
                                  }
                                />
                                {result.country + ', ' + city}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pt-10 text-center text-[#797c80] text-base font-semibold leading-snug md:absolute md:left-1/2 md:-translate-x-1/2">{`"${searchTerm}${t(
                    'noresults',
                  )}`}</p>
                )
              ) : (
                // 대륙 > 나라 버튼 표시

                renderContinents(
                  lang === 'en' ? enNations : nations,
                  handleTempSelect,
                  crntNation,
                )
              )}
            </div>
          </div>
          <Desktop>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                onClick={onClose}
                className="w-[196px] h-16 px-3 py-1.5 bg-[#f4f6f9] rounded-xl justify-center items-center gap-2.5 inline-flex text-[#44484c] text-xl font-semibold leading-loose"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  onClose();
                  handleSelect();
                }}
                className="w-[196px] h-16 px-3 py-1.5 bg-[#0582ff] rounded-xl justify-center items-center gap-2.5 inline-flex text-white text-xl font-semibold leading-loose"
              >
                확인
              </button>
            </div>
          </Desktop>
        </div>
      </div>
    </>
  );
};

'use client';

import { useSearchStore } from '@/store/useSearchStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';

const iconLeft = '/images/ic-left.svg';
const iconclose = '/images/ic-xmark.svg';
const iconHelp = '/images/ic-help.svg';

const SearchPage = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleTooltipToggle = () => {
    setIsTooltipVisible(!isTooltipVisible); // 클릭 시 메시지 박스 표시/숨기기
  };

  const router = useRouter();
  const storedSearches =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('recentSearches') || '[]')
      : []; // 로컬 스토리지에서 recentSearches를 가져오고, 없으면 빈 공백으로 설정해요.
  const keyword = useSearchStore((state) => state.keyword);
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const inputRef = useRef<HTMLInputElement>(null); // 초기값 null로 설정

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      searchQuery: '',
      recentSearches: storedSearches,
    },
  });
  const recentSearches: string[] = watch('recentSearches', storedSearches); // 최근 검색어 리스트
  const query = watch('searchQuery'); // 검색 입력값

  useEffect(() => {
    if (keyword && inputRef.current) {
      inputRef.current.value = keyword; // `keyword`가 있을 때만 자동으로 설정
    }
    inputRef.current?.focus();
  }, [keyword, setValue, inputRef]); // `keyword`가 변경될 때마다 실행

  const handleSearch = () => {
    if (!query.trim()) return;
    setKeyword(query);
    // 최근 검색어 업데이트
    const updatedSearches = [
      query,
      ...recentSearches.filter((item: string) => item !== query),
    ].slice(0, 9); // 최근 검색어는 10개까지만 저장됩니다.
    setValue('recentSearches', updatedSearches); // 폼 내부 상태 업데이트
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    setValue('searchQuery', '');
    router.push(`/search/${query}`);
  };

  const handleRecentSearchClick = async (term: string) => {
    setKeyword(term);
    setValue('searchQuery', term); // 클릭 시 입력 필드가 최근 검색어로 고정된다.
    router.push(`/search/${term}`);
  };

  const handleRecentSearchDelete = (term: string) => {
    // 클릭 시에 로컬에서 삭제해서, 최근 검색어를 정리해요.
    const updatedSearches = recentSearches.filter((item) => {
      return item !== term;
    });
    setValue('recentSearches', updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleClearRecentSearches = () => {
    const updatedSearches = [] as string[];
    setValue('recentSearches', updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex flex-row items-center"
      >
        <Link href="/">
          <Image
            src={iconLeft}
            alt="left icon"
            width={24}
            height={24}
            className="ml-[20px] mr-[8px]"
          />
        </Link>
        <div className="flex flex-row justify-center items-center relative">
          <input
            {...register('searchQuery')}
            ref={inputRef}
            type="text"
            placeholder="나라와 카테고리 모두 검색할 수 있어요."
            className="bg-[#F9F9F9] rounded-[12px] text-[14px] h-[44px] w-[303px] mt-[6px] mb-[11px] py-[12px] px-[16px]"
          />
          <button
            type="button"
            className="absolute top-[16px] right-[10px]"
            onClick={() => setValue('searchQuery', '')}
          >
            <Image src={iconclose} alt="close icon" width={24} height={24} />
          </button>
        </div>
      </form>
      <div className="inner">
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <p className="text-[16px] font-[600]">최근 검색어</p>
              <Image
                src={iconHelp}
                alt="Help icon"
                width={16}
                height={16}
                className="ml-[3px] cursor-pointer"
                onClick={handleTooltipToggle}
              />
            </div>
            <div>
              <button onClick={handleClearRecentSearches}>
                <span className="text-[12px] text-[#45484D] tracking-[-0.24] underline underline-offset-[1px]">
                  전체 삭제
                </span>
              </button>
            </div>
          </div>
          {isTooltipVisible && (
            <div className="absolute top-8 right-[120px] w-[224px]">
              <div className="flex flex-row items-center relative max-w-md py-[8px] pl-[12px] pr-[12px] bg-[#3A474E] rounded-md shadow-md">
                <p className="text-[12px] text-white pr-[4px] font-[500] tracking-[-0.24px]">
                  최근 검색어는 10개까지만 볼 수 있어요
                </p>
                <RxCross2
                  size={18}
                  onClick={handleTooltipToggle}
                  className="cursor-pointer"
                  style={{ color: 'white' }}
                />
                <div className="absolute -top-2 left-[81px] w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-[#3A474E]"></div>
              </div>
            </div>
          )}
          <ul className="flex flex-row gap-[4px] items-center overflow-x-auto whitespace-nowrap">
            {recentSearches && recentSearches.length > 0 ? (
              recentSearches.map((term, index) => (
                <li
                  key={index}
                  className="flex flex-row justify-between items-center rounded-full border border-[#DFE1E5] mt-[20px]"
                >
                  <form
                    onSubmit={handleSubmit(handleSearch)}
                    className="flex flex-row items-center px-[16px] py-[9.5px]"
                  >
                    <button
                      type="submit"
                      className="text-[14px] text-[#45484D] pr-[4px]"
                      onClick={() => handleRecentSearchClick(term)}
                    >
                      {term}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRecentSearchDelete(term)}
                    >
                      <RxCross2
                        size={16}
                        className="cursor-pointer"
                        style={{ color: '#797C80' }}
                      />
                    </button>
                  </form>
                </li>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center w-full">
                <p className="text-xl font-bold pt-10 text-center">
                  검색어를 입력해주세요.
                </p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
export default SearchPage;

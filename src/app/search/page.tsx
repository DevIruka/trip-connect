'use client';

import { useSearchStore } from '@/store/useSearchStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { IoMdCloseCircle } from 'react-icons/io';

const SearchPage = () => {
  const router = useRouter();
  const storedSearches =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('recentSearches') || '[]')
      : []; // 로컬 스토리지에서 recentSearches를 가져오고, 없으면 빈 공백으로 설정해요.

  const keyword = useSearchStore((state) => state.keyword);
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      searchQuery: '',
      recentSearches: storedSearches,
    },
  });
  const recentSearches: string[] = watch('recentSearches', storedSearches); // 최근 검색어 리스트
  const query = watch('searchQuery'); // 검색 입력값

  useEffect(() => {
    console.log(keyword);
    if (keyword) {
      setValue('searchQuery', keyword);
    }
  }, [keyword, setValue]);

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
    router.push(`/search/${term}`)
  };

  const handleRecentSearchDelete = (term: string) => {
    // 클릭 시에 로컬에서 삭제해서, 최근 검색어를 정리해요.
    const updatedSearches = recentSearches.filter((item) => {
      return item !== term;
    });
    setValue('recentSearches', updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  return (
    <div className="inner">
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex flex-row items-center gap-2"
      >
        <Link href="/">
          <IoIosArrowBack size={30} />
        </Link>
        <input
          {...register('searchQuery')}
          type="text"
          placeholder="검색어를 입력해주세요"
          className="border border-black rounded-full h-8 w-72 mt-1 mb-1 px-4"
        />
        <button
          type="button"
          className="absolute right-14 top-2"
          onClick={() => setValue('searchQuery', '')}
        >
          <IoMdCloseCircle size={25} />
        </button>
        <Link href="/">
          <span className="mr-1">닫기</span>
        </Link>
      </form>
      <div className="flex flex-col">
        <p className="font-extrabold m-2">최근 검색어</p>
        <ul className="flex flex-col">
          {recentSearches?.map((term, index) => {
            return (
              <li key={index} className="flex flex-row justify-between">
                <form
                  onSubmit={handleSubmit(handleSearch)}
                  className="flex flex-row items-center"
                >
                  <button
                    type="submit"
                    className="text-left"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRecentSearchDelete(term)}
                    className="ml-2"
                  >
                    삭제
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default SearchPage;

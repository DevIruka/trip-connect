'use client';

import { useSearchStore } from '@/store/useSearchStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSearchHandlers from './_hooks/useSearchHandlers';
import SearchBar from './_components/SearchBar';
import SearchToolTip from './_components/SearchToolTip';
import RecentSearchList from './_components/RecentSearchList';

const SearchPage = () => {
  const router = useRouter();

  const storedSearches =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('recentSearches') || '[]')
      : []; // 로컬 스토리지에서 recentSearches를 가져오고, 없으면 빈 공백으로 설정해요.
      
  const keyword = useSearchStore((state) => state.keyword);

  const { register, handleSubmit, setValue, watch, setFocus } = useForm({
    defaultValues: {
      searchQuery: '',
      recentSearches: storedSearches as string[],
    },
  });
  const recentSearches: string[] = watch('recentSearches', storedSearches); // 최근 검색어 리스트
  const query = watch('searchQuery'); // 검색 입력값

  useEffect(() => {
    if (keyword) {
      setValue('searchQuery', keyword); // 검색창 값 업데이트
    }
    setFocus('searchQuery');
  }, [keyword, setValue, setFocus]);

  const {
    handleClearRecentSearches,
    handleRecentSearchClick,
    handleRecentSearchDelete,
    handleSearch,
  } = useSearchHandlers({ query, recentSearches, router, setValue });

  return (
    <>
      <SearchBar
        handleSearch={handleSearch}
        handleSubmit={handleSubmit}
        register={register}
        setValue={setValue}
      />
      <div className="inner">
        <div className="flex flex-col">
          <SearchToolTip
            handleClearRecentSearches={handleClearRecentSearches}
          />
          <RecentSearchList
            handleRecentSearchClick={handleRecentSearchClick}
            handleRecentSearchDelete={handleRecentSearchDelete}
            handleSearch={handleSearch}
            handleSubmit={handleSubmit}
            recentSearches={recentSearches}
          />
        </div>
      </div>
    </>
  );
};
export default SearchPage;

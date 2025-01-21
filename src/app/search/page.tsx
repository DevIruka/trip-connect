'use client';

import { useSearchStore } from '@/store/useSearchStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSearchHandlers from './_hooks/useSearchHandlers';
import SearchBar from './_components/SearchBar';
import SearchToolTip from './_components/SearchToolTip';
import RecentSearchList from './_components/RecentSearchList';

const SearchPage = () => {
  const router = useRouter();

  const [storedSearches, setStoredSearches] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setStoredSearches(searches);
      setRecentSearches(searches)
    }
  }, []);
      
  const keyword = useSearchStore((state) => state.keyword);

  const { register, handleSubmit, setValue, watch, setFocus } = useForm({
    defaultValues: {
      searchQuery: '',
      recentSearches: storedSearches as string[],
    },
  });
  // const recentSearches: string[] = watch('recentSearches', storedSearches); // 최근 검색어 리스트
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
  } = useSearchHandlers({ query, recentSearches, router, setValue , setRecentSearches });

  return (
    <>
      <SearchBar
        handleSearch={handleSearch}
        handleSubmit={handleSubmit}
        register={register}
        setValue={setValue}
      />
      <div className="inner menuscrollbar">
        <div className="flex flex-col">
          <SearchToolTip
            handleClearRecentSearches={handleClearRecentSearches}
            recentSearches={recentSearches}
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

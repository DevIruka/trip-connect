import { useSearchStore } from '@/store/useSearchStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { UseFormSetValue } from 'react-hook-form';

type useSearchHandlersProps = {
  router: AppRouterInstance;
  setValue: UseFormSetValue<{
    searchQuery: string;
    recentSearches: string[];
  }>;
  query: string;
  recentSearches: string[];
};

const useSearchHandlers = ({
  router,
  setValue,
  query,
  recentSearches,
}: useSearchHandlersProps) => {
  const setKeyword = useSearchStore((state) => state.setKeyword);

  const handleSearch = () => {
    if (!query.trim()) return;
    setKeyword(query);
    const storedSearches = JSON.parse(
      localStorage.getItem('recentSearches') || '[]',
    );

    // 새 검색어를 배열에 추가 (중복 방지하고 최신 검색어가 앞에 오도록)
    const updatedSearches = [
      query,
      ...storedSearches.filter((item: string) => item !== query),
    ].slice(0, 10); // 최대 10개까지만 유지

    // localStorage에 저장
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
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

  return {
    handleSearch,
    handleRecentSearchClick,
    handleRecentSearchDelete,
    handleClearRecentSearches,
  };
};

export default useSearchHandlers;

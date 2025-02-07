import { useState } from 'react';
import { useAllPosts } from './useAllPosts';
import { nation } from '../_types/homeTypes';

export const useFilteredPosts = (category: string) => {
  // 모든 게시물 가져오기
  const { sortedPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAllPosts();

  // 주제별 카테고리 필터링
  const categoryFilteredPosts = sortedPosts.filter((post) => {
    if (category === 'all') return true;
    if ('category' in post) return post.category?.includes(category);
    if ('request_posts' in post && post.request_posts)
      return post.request_posts?.category.includes(category);
    return false;
  });

  // 질문/답변 필터링 상태
  const [filterType, setFilterType] = useState<
    'latest' | 'request' | 'response'
  >('latest');

  const filteredPosts = categoryFilteredPosts.filter((post) => {
    if (filterType === 'request') return !post.request_id; // 질문글 (request_id가 없는 경우)
    if (filterType === 'response') return !!post.request_id; // 답변글 (request_id가 있는 경우)
    return true; // 최신 (모두 표시)
  });

  // 국가 필터링 상태
  const [nationFilter, setNationFilter] = useState<nation | null>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem('selectedLocation')!);
    }
    return null;
  });

  // 국가 필터링 적용
  const nationFilteredPosts = filteredPosts.filter((post) => {
    if (!nationFilter) return true; // 필터 미적용 시 모든 게시물 표시

    const { city, country } = nationFilter;

    if (city) {
      // 질문글 처리
      if (!post.request_id && !post.country_city?.includes(city)) return false;
      // 답변글 처리
      if (post.request_id && !post.verified_country?.includes(city))
        return false;
    } else {
      // 질문글 처리
      if (!post.request_id && !post.country_city?.includes(country))
        return false;
      // 답변글 처리
      if (post.request_id && !post.verified_country?.includes(country))
        return false;
    }

    return true;
  });

  return {
    nationFilteredPosts,
    filterType,
    setFilterType,
    setNationFilter,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

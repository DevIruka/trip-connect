import { supabase } from '@/utils/supabase/supabaseClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { fetchPosts } from '../../supabase_api/search/fetchPosts';

const useInfinitePosts = (
  keyword: string | null,
  setCountReq: Dispatch<SetStateAction<number | null>>,
  setCountRes: Dispatch<SetStateAction<number | null>>,
  setNoResults: Dispatch<SetStateAction<boolean>>,
) => {
  return useInfiniteQuery({
    queryKey: ['search_posts', keyword],
    queryFn: ({ pageParam }) =>
      fetchPosts(
        { pageParam, keyword },
        setCountReq,
        setCountRes,
        setNoResults,
      ),
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined, // nextOffset이 없으면 더 이상 불러오지 않음
    initialPageParam: 0, // 시작 페이지는 0번
  });
};

export default useInfinitePosts;

'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { addBookmark, deleteBookmark } from '../_hooks/useBookmark';

const PAGE_SIZE = 7;

const PostList = () => {
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7'; // 고정된 사용자 ID
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState('All'); // 현재 필터 상태 (기본: All)

  const fetchPosts = async ({ pageParam = 0 }) => {
    const from = pageParam * PAGE_SIZE; // 시작 인덱스
    const to = from + PAGE_SIZE - 1; // 끝 인덱스

    const query = supabase.from('request_posts').select('*').range(from, to);

    // 필터가 'All'이 아니면 eq 조건 추가
    if (filter !== 'All') {
      query.eq('category', filter);
    }

    const { data: request_posts, error } = await query;

    if (error) throw new Error(error.message);
    return {
      data: request_posts,
      nextPage: request_posts.length === PAGE_SIZE ? pageParam + 1 : null, // 다음 페이지가 있는지 여부
    };
  };

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['request_posts', filter],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 반환
    });

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  //북마크
  const { data: bookmarks } = useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: async () => {
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId);
      return bookmarks;
    },
    initialData: [],
  });
  const isPostBookmarked = (postId: string) =>
    bookmarks?.some((bookmark) => bookmark.request_id === postId);

  // 북마크 추가 Mutation
  const addBookmarkMutation = useMutation({
    mutationFn: (postId: string) => addBookmark(postId, userId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData(['bookmarks', userId], (old: any) => [
        ...(old || []),
        { request_id: postId },
      ]);
    },
  });

  // 북마크 삭제 Mutation
  const deleteBookmarkMutation = useMutation({
    mutationFn: (postId: string) => deleteBookmark(postId, userId),
    onSuccess: (_, postId) => {
      queryClient.setQueryData(['bookmarks', userId], (old: any) =>
        (old || []).filter((bookmark: any) => bookmark.request_id !== postId),
      );
    },
  });

  return (
    <div className="inner overflow-y-scroll">
      <header className="grid">
        <div className="flex gap-4">
          <button onClick={() => setFilter('All')}>홈</button>
          <button onClick={() => setFilter('맛집')}>맛집</button>
          <button onClick={() => setFilter('장소')}>장소</button>
          <button onClick={() => setFilter('숙소')}>숙소</button>
          <button onClick={() => setFilter('이벤트')}>이벤트</button>
          <button onClick={() => setFilter('일정/경비')}>일정/경비</button>
        </div>
      </header>
      <div>
        <button
          onClick={() => {
            location.href = `/request`;
          }}
        >
          질문하기
        </button>
      </div>
      <button>나라 선택하기</button>
      {allPosts?.map((post) => {
        const bookmarked = isPostBookmarked(post.id); // 개별 게시물의 북마크 상태 확인

        return (
          <div key={post.id} className="border-2 flex">
            <div>
              <div>{post.title}</div>
              <div>{post.content}</div>
              <div>{post.credit}</div>
              <div>{post.date_end}</div>
            </div>
            {bookmarked ? (
              <button onClick={() => deleteBookmarkMutation.mutate(post.id)}>
                북마크 해제
              </button>
            ) : (
              <button onClick={() => addBookmarkMutation.mutate(post.id)}>
                북마크
              </button>
            )}
          </div>
        );
      })}

      {/* 더보기 버튼 */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          {isFetchingNextPage ? '로딩 중...' : '더보기'}
        </button>
      )}
    </div>
  );
};

export default PostList;

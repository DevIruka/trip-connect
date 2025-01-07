'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const PAGE_SIZE = 5;

const fetchPosts = async ({ pageParam = 0 }) => {
  const from = pageParam * PAGE_SIZE; // 시작 인덱스
  const to = from + PAGE_SIZE - 1; // 끝 인덱스

  const { data: request_posts, error } = await supabase
    .from('request_posts')
    .select('*')
    .range(from, to);
  if (error) throw new Error(error.message);
  return {
    data: request_posts,
    nextPage: request_posts.length === PAGE_SIZE ? pageParam + 1 : null, // 다음 페이지가 있는지 여부
  };
};

const PostList = () => {
  const [filter, setFilter] = useState('All'); // 현재 필터 상태 (기본: All)

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['request_posts'],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => lastPage.nextPage, // 다음 페이지 번호 반환
    });

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  const filteredPosts =
    filter === 'All'
      ? allPosts
      : allPosts?.filter((post) => post.category === filter);

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
        <button>질문하기</button>
      </div>
      <button>나라 선택하기</button>
      {filteredPosts?.map((post) => {
        return (
          <div key={post.id} className="border-2">
            <div>{post.title}</div>
            <div>{post.content}</div>
            <div>{post.credit}</div>
            <div>{post.date_end}</div>
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

      {/* 모든 데이터를 불러왔을 경우 */}
      {!hasNextPage && <p>모든 데이터를 불러왔습니다.</p>}
    </div>
  );
};

export default PostList;

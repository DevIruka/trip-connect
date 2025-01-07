'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useEffect, useState } from 'react';

const PostList = () => {
  const [requestPosts, setRequestPosts] = useState();
  const [filter, setFilter] = useState('All'); // 현재 필터 상태 (기본: All)
  const filteredPosts =
    filter === 'All'
      ? requestPosts
      : requestPosts?.filter((post) => post.category === filter);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: request_posts, error } = await supabase
        .from('request_posts')
        .select('*')
        .range(0, 9);
      setRequestPosts(request_posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-[800px] overflow-y-scroll">
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
          <div key={post.id}>
            <div>{post.title}</div>
            <div>{post.content}</div>
            <div>{post.credit}</div>
            <div>{post.date_end}</div>
          </div>
        );
      })}
      <button>더보기</button>
    </div>
  );
};

export default PostList;

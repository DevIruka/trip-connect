import React from 'react';
import { createClient } from '../../utils/supabase/server';

const Homepage = async () => {
  const supabase = await createClient();
  const { data: request_posts, error } = await supabase
    .from('request_posts')
    .select('*')
    .range(0, 9);
  console.log('request_posts', request_posts);
  return (
    <div>
      <header className="grid">
        <div className="flex gap-10">
          <button>홈</button>
          <button>맛집</button>
          <button>장소</button>
          <button>숙소</button>
          <button>이벤트</button>
          <button>일정/경비</button>
        </div>
      </header>
      <button>나라 선택하기</button>
      <button>질문하기</button>
      <button>랜덤게시물</button>
    </div>
  );
};

export default Homepage;

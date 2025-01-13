'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/supabaseClient';

type Props = {
  activeTab: 'written' | 'response' | 'bookmark';
  onUpdateCounts?: () => void; // 카운트를 업데이트하는 콜백 함수
};

const CategoryTabs = ({ activeTab, onUpdateCounts }: Props) => {
  const [counts, setCounts] = useState({
    written: 0,
    response: 0,
    bookmark: 0,
  });

  const fetchCounts = async () => {
    try {
      // 로그인된 사용자 정보 가져오기
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('No active session or user not logged in.');
        return;
      }

      const userId = userData.user.id; // 사용자 ID

      // 작성글 개수 가져오기
      const { count: writtenCount } = await supabase
        .from('request_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // 답변글 개수 가져오기
      const { count: responseCount } = await supabase
        .from('response_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // 북마크 개수 가져오기
      const { count: bookmarkCount } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      setCounts({
        written: writtenCount || 0,
        response: responseCount || 0,
        bookmark: bookmarkCount || 0,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  // 부모에서 전달받은 onUpdateCounts 콜백이 실행될 때 카운트를 갱신
  useEffect(() => {
    if (onUpdateCounts) {
      onUpdateCounts();
    }
  }, [onUpdateCounts]);

  return (
    <div
      className="flex justify-between items-center border-b border-[#D9D9D9] mb-6"
      style={{ position: 'sticky', marginTop: '10px' }}
    >
      <Link href="/mypage/request">
        <button
          className={`relative pb-2 border-b-2 ${
            activeTab === 'written'
              ? 'border-black font-bold'
              : 'border-transparent'
          } hover:border-black`}
        >
          <span className="text-lg font-bold text-black">작성글</span>
          <span className="text-sm text-gray-600 ml-2">({counts.written})</span>
        </button>
      </Link>

      <Link href="/mypage/response">
        <button
          className={`relative pb-2 border-b-2 ${
            activeTab === 'response'
              ? 'border-black font-bold'
              : 'border-transparent'
          } hover:border-black`}
        >
          <span className="text-lg font-bold text-black">답변글</span>
          <span className="text-sm text-gray-600 ml-2">
            ({counts.response})
          </span>
        </button>
      </Link>

      <Link href="/mypage/bookmark">
        <button
          className={`relative pb-2 border-b-2 ${
            activeTab === 'bookmark'
              ? 'border-black font-bold'
              : 'border-transparent'
          } hover:border-black`}
        >
          <span className="text-lg font-bold text-black">북마크</span>
          <span className="text-sm text-gray-600 ml-2">
            ({counts.bookmark})
          </span>
        </button>
      </Link>
    </div>
  );
};

export default CategoryTabs;

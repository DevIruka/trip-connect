'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';

type Props = {
  activeTab: 'written' | 'response' | 'bookmark';
  onUpdateCounts?: () => void;
};

const CategoryTabs = ({ activeTab, onUpdateCounts }: Props) => {
  const { user } = useUserStore();
  const [counts, setCounts] = useState({
    written: 0,
    response: 0,
    bookmark: 0,
  });

  const fetchCounts = useCallback(async () => {
    if (!user?.id) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      // 작성글 개수 가져오기
      const { count: writtenCount, error: writtenError } = await supabase
        .from('request_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (writtenError) {
        console.error('작성글 카운트 가져오기 실패:', writtenError);
      }

      // 답변글 개수 가져오기
      const { count: responseCount, error: responseError } = await supabase
        .from('response_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (responseError) {
        console.error('답변글 카운트 가져오기 실패:', responseError);
      }

      // 북마크 개수 가져오기
      const { count: bookmarkCount, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (bookmarkError) {
        console.error('북마크 카운트 가져오기 실패:', bookmarkError);
      }

      setCounts({
        written: writtenCount || 0,
        response: responseCount || 0,
        bookmark: bookmarkCount || 0,
      });
    } catch (error) {
      console.error('카운트 가져오기 실패:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

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

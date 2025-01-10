'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/supabaseClient';

type Props = {
  activeTab: 'written' | 'response' | 'bookmark';
};

const CategoryTabs = ({ activeTab }: Props) => {
  const [counts, setCounts] = useState({
    written: 0,
    response: 0,
    bookmark: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // 작성글 개수 가져오기
        const { count: writtenCount } = await supabase
          .from('request_posts')
          .select('*', { count: 'exact' });

        // 답변글 개수 가져오기
        const { count: responseCount } = await supabase
          .from('response_posts')
          .select('*', { count: 'exact' });

        // 북마크 개수 가져오기
        const { count: bookmarkCount } = await supabase
          .from('bookmarks')
          .select('*', { count: 'exact' });

        setCounts({
          written: writtenCount || 0,
          response: responseCount || 0,
          bookmark: bookmarkCount || 0,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

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

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';

type Props = {
  activeTab: 'written' | 'purchased' | 'bookmark';
  onUpdateCounts?: () => void;
};

const CategoryTabs = ({ activeTab, onUpdateCounts }: Props) => {
  const { user } = useUserStore();
  const [counts, setCounts] = useState({
    written: 0,
    purchased: 0,
    bookmark: 0,
  });
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    if (!user?.id) {
      setError('사용자 정보가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      const [writtenRes, responseRes, purchasedRes, bookmarkRes] =
        await Promise.all([
          supabase
            .from('request_posts')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('response_posts')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('purchased_users')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('bookmarks')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id),
        ]);

      // 결과 합산
      setCounts({
        written: (writtenRes.count || 0) + (responseRes.count || 0),
        purchased: purchasedRes.count || 0,
        bookmark: bookmarkRes.count || 0,
      });
      setError(null); 
    } catch (err) {
      console.error('카운트 가져오기 실패:', err);
      setError('데이터를 가져오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    if (onUpdateCounts) {
      onUpdateCounts();
    }
  }, [counts, onUpdateCounts]);

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const tabs = [
    {
      key: 'written',
      label: '작성글',
      count: counts.written,
      link: '/mypage/request',
    },
    {
      key: 'purchased',
      label: '구매한 글',
      count: counts.purchased,
      link: '/mypage/purchase',
    },
    {
      key: 'bookmark',
      label: '북마크',
      count: counts.bookmark,
      link: '/mypage/bookmark',
    },
  ];

  return (
    <div
      className="flex justify-between items-center border-b border-[#D9D9D9] mb-6"
      style={{ position: 'sticky', marginTop: '10px' }}
    >
      {tabs.map((tab) => (
        <Link key={tab.key} href={tab.link}>
          <button
            className={`relative pb-2 border-b-2 ${
              activeTab === tab.key
                ? 'border-black font-bold'
                : 'border-transparent'
            } hover:border-black`}
          >
            <span className="text-lg font-bold text-black">{tab.label}</span>
            <span className="text-sm text-gray-600 ml-2">{tab.count}</span>
          </button>
        </Link>
      ))}
    </div>
  );
};

export default CategoryTabs;

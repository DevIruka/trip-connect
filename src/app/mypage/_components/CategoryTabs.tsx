'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import search from '@/data/images/ic-Search.svg';
const lefticon = '/images/ic-left.svg';

type Props = {
  activeTab: 'written' | 'purchased' | 'bookmark';
};

const CategoryTabs: React.FC<Props> = ({ activeTab }) => {
  const { user } = useUserStore();
  const [counts, setCounts] = useState({
    written: 0,
    purchased: 0,
    bookmark: 0,
  });
  const router = useRouter();

  const fetchCounts = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [writtenRes, responseRes, purchasedRes, bookmarkRes] =
        await Promise.all([
          supabase
            .from('request_posts')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('response_posts')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('purchased_users')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
          supabase
            .from('bookmarks')
            .select('id', { count: 'exact' })
            .eq('user_id', user.id),
        ]);

      setCounts({
        written: (writtenRes.count || 0) + (responseRes.count || 0),
        purchased: purchasedRes.count || 0,
        bookmark: bookmarkRes.count || 0,
      });
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, user?.id]);

  const tabs = [
    {
      key: 'written',
      label: '작성한 글',
      count: counts.written,
      link: '/mypage/filters/all',
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
    <div>
      {/* 헤더 섹션 */}
      <div
        className="flex flex-row justify-between items-center"
        style={{
          height: '56px',
          padding: '10px 20px',
        }}
      >
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
        <Image src={search} width={24} height={24} alt="search" />
      </div>

      {/* 프로필 섹션 */}
      <div
        className="flex items-center"
        style={{
          height: '48px',
          padding: '8px 20px',
        }}
      >
        <h2
          className="text-[20px] font-[700] text-[#45484D]"
          style={{
            textAlign: 'left',
            lineHeight: '32px',
            letterSpacing: '-0.4px',
            fontFamily: 'Pretendard',
          }}
        >
          나의 활동 내역
        </h2>
      </div>

      <div className="flex items-center justify-center mt-4 w-[335px] border-b border-[#DFE1E5]">
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.link}>
            <button
              className={`flex items-center justify-center w-[109px] py-[12px] h-full ${
                activeTab === tab.key
                  ? 'border-b-2 border-black'
                  : 'border-b-2 border-transparent'
              }`}
            >
              <span
                className={`text-[16px] font-semibold ${
                  activeTab === tab.key ? 'text-black' : 'text-[#A9A9A9]'
                }`}
                style={{
                  fontFamily: 'Pretendard',
                  lineHeight: 'normal',
                  letterSpacing: '-0.32px',
                }}
              >
                {tab.label}
              </span>
              <span
                className={`text-[16px] font-semibold ml-[4px] ${
                  activeTab === tab.key ? 'text-[#80BFFF]' : 'text-[#A9A9A9]'
                }`}
                style={{
                  fontFamily: 'Pretendard',
                  lineHeight: 'normal',
                  letterSpacing: '-0.32px',
                }}
              >
                {tab.count}
              </span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;

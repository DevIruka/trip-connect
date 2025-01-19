'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';

type Props = {
  activeTab: 'written' | 'purchased' | 'bookmark';
};

const CategoryTabs: React.FC<Props> = ({ activeTab }) => {
  const { user } = useUserStore();
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    written: 0,
    purchased: 0,
    bookmark: 0,
  });

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
    const fetchProfileImg = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile_img')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile image:', error);
          setProfileImg(null);
        } else {
          setProfileImg(data?.profile_img || null);
        }
      } catch (e) {
        console.error('Unexpected error:', e);
        setProfileImg(null);
      }
    };

    fetchProfileImg();
    fetchCounts();
  }, [fetchCounts, user?.id]);

  const tabs = [
    {
      key: 'written',
      label: '작성글',
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
      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            {profileImg ? (
              <Image
                src={profileImg}
                alt="Profile"
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {/* 기본 이미지 */}
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold">나의 활동 내역</h2>
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex justify-between items-center border-b border-[#D9D9D9] mb-6">
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.link}>
            <button
              className={`relative pb-2 border-b-2 ${
                activeTab === tab.key
                  ? 'border-black font-bold'
                  : 'border-transparent'
              } hover:border-black`}
            >
              <span className="text-lg font-bold">{tab.label}</span>
              <span className="text-sm text-gray-600 ml-2">{tab.count}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;

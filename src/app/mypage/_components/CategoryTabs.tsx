'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const lefticon = '/images/ic-left.svg';

type Props = {
  activeTab: 'written' | 'purchased' | 'bookmark';
};

type Counts = {
  written: number;
  purchased: number;
  bookmark: number;
};

const CategoryTabs: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter();
  const { t } = useTranslation('mypage');
  const { user } = useUserStore();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.id) return;

      try {
        const [
          { count: requestCount, error: requestError },
          { count: responseCount, error: responseError },
          { count: purchasedCount, error: purchasedError },
          { count: bookmarkCount, error: bookmarkError },
        ] = await Promise.all([
          supabase
            .from('request_posts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('response_posts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('purchased_users')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
        ]);

        if (requestError || responseError || purchasedError || bookmarkError) {
          throw new Error('Error fetching counts');
        }

        setCounts({
          written: (requestCount || 0) + (responseCount || 0),
          purchased: purchasedCount || 0,
          bookmark: bookmarkCount || 0,
        });
      } catch (error) {
        console.error(t('fetchCountsError'), error);
      }
    };

    fetchCounts();
  }, [user?.id, t]);

  // useMemo로 tabs 배열을 메모이제이션
  const tabs = useMemo(
    () => [
      { key: 'written', label: t('written'), link: '/mypage/filters/all' },
      { key: 'purchased', label: t('purchased'), link: '/mypage/purchase' },
      { key: 'bookmark', label: t('bookmark'), link: '/mypage/bookmark' },
    ],
    [t],
  );

  // useCallback으로 클릭 핸들러 메모이제이션
  const handleTabClick = useCallback(
    (link: string) => {
      router.push(link);
    },
    [router],
  );

  return (
    <div className="w-full bg-white md:max-w-[872px] mx-auto md:px-[36px]">
      {/* 헤더 섹션 */}
      <button
        onClick={() => router.push('/mypage')}
        className="flex items-center justify-center pt-4 md:hidden"
      >
        <Image src={lefticon} width={24} height={24} alt={t('back')} priority />
      </button>

      {/* 프로필 섹션 */}
      <div className="flex items-center h-12 px-5 md:px-0 md:h-[71px] md:w-[800px] md:mx-auto md:my-[40px] md:mb-[28px] md:pt-[10px] md:pb-[10px]">
        <h2 className="text-[20px] font-bold text-[#45484D] leading-8 tracking-tight font-Pretendard md:text-[32px]">
          {t('title')}
        </h2>
      </div>

      {/* 탭 섹션 */}
      <div className="flex items-center justify-around bg-white h-12 relative">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.link)}
            className={`flex-1 text-center py-2 relative ${
              activeTab === tab.key
                ? 'text-black font-bold'
                : 'text-gray-500 font-normal'
            }`}
          >
            <span
              className={`text-[16px] leading-5 tracking-tight md:text-[18px] ${
                activeTab === tab.key ? 'font-semibold' : 'font-normal'
              }`}
            >
              {tab.label}
            </span>
            {counts && (
              <span
                className={`ml-2 text-[16px] leading-5 font-semibold font-Pretendard md:text-[18px] ${
                  activeTab === tab.key ? 'text-[#80BFFF]' : 'text-gray-500'
                }`}
              >
                {counts[tab.key as keyof Counts]}
              </span>
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                activeTab === tab.key ? 'bg-black' : 'bg-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;

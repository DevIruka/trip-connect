import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import search from '@/data/images/ic-Search.svg';

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
  const { user } = useUserStore();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.id) {
        console.error('User ID가 없습니다.');
        return;
      }

      try {
        const { count: requestCount, error: requestError } = await supabase
          .from('request_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (requestError) throw requestError;

        const { count: responseCount, error: responseError } = await supabase
          .from('response_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (responseError) throw responseError;

        const totalWrittenCount = (requestCount || 0) + (responseCount || 0);

        const { count: purchasedCount, error: purchasedError } = await supabase
          .from('purchased_users')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (purchasedError) throw purchasedError;

        const { count: bookmarkCount, error: bookmarkError } = await supabase
          .from('bookmarks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (bookmarkError) throw bookmarkError;

        setCounts({
          written: totalWrittenCount,
          purchased: purchasedCount || 0,
          bookmark: bookmarkCount || 0,
        });
      } catch (error) {
        console.error('카운트를 가져오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchCounts();
  }, [user?.id]);

  const tabs = [
    { key: 'written', label: '작성한 글', link: '/mypage/filters/all' },
    { key: 'purchased', label: '구매한 글', link: '/mypage/purchase' },
    { key: 'bookmark', label: '북마크', link: '/mypage/bookmark' },
  ];

  return (
    <div>
      {/* 헤더 섹션 */}
      <div className="flex flex-row justify-between items-center h-14 px-5">
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
        <Image src={search} width={24} height={24} alt="search" />
      </div>

      {/* 프로필 섹션 */}
      <div className="flex items-center h-12 px-5">
        <h2 className="text-[20px] font-bold text-[#45484D] leading-8 tracking-tight font-Pretendard">
          나의 활동 내역
        </h2>
      </div>

      {/* 탭 섹션 */}
      <div className="flex items-center justify-around border-b bg-white h-12 relative">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => router.push(tab.link)}
            className={`flex-1 text-center py-2 relative ${
              activeTab === tab.key
                ? 'text-black font-bold'
                : 'text-gray-500 font-normal'
            }`}
          >
            <span
              className={`text-[14px] leading-5 tracking-tight ${
                activeTab === tab.key ? 'font-semibold' : 'font-normal'
              }`}
            >
              {tab.label}
            </span>
            {counts && (
              <span
                className={`ml-2 text-[16px] leading-5 font-semibold font-Pretendard ${
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

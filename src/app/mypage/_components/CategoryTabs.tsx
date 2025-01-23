import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';

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
        const { count: writtenCount, error: writtenError } = await supabase
          .from('request_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (writtenError) throw writtenError;

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
          written: writtenCount || 0,
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
    <div
      className="flex items-center justify-around border-b bg-white"
      style={{
        height: '48px',
        borderBottom: '1px solid #DFE1E5',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => router.push(tab.link)}
          className={`flex-1 text-center py-2 ${
            activeTab === tab.key
              ? 'border-b-2 border-black text-black font-bold'
              : 'text-gray-500'
          }`}
        >
          <span
            className={`text-[14px] leading-[20px] ${
              activeTab === tab.key ? 'font-semibold' : 'font-normal'
            }`}
            style={{ letterSpacing: '-0.28px' }}
          >
            {tab.label}
          </span>
          {counts && (
            <span
              className={`ml-2 ${
                activeTab === tab.key ? 'text-black' : 'text-gray-400'
              }`}
            >
              {counts[tab.key as keyof Counts]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;

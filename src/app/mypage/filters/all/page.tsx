'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import RequestPostCard from '../../_components/RequestPostCard';
import ResponsePostCard from '../../_components/ResponsePostCard'; 
import CategoryTabs from '../../_components/CategoryTabs';
import stripHtmlTags from '../../_util/striptHtmlTags';


const convertTopicsToKorean = (topics: string[]): string[] => {
  const topicMapping: Record<string, string> = {
    food: '맛집',
    shopping: '쇼핑',
    lodging: '숙소',
    event: '이벤트',
    'schedule-expenses': '일정/경비',
    culture: '문화',
    history: '역사',
    activity: '액티비티',
    etc: '기타',
  };
  return topics.map((topic) => topicMapping[topic] || topic);
};

type RequestPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'question';
  user_id: string;
  date_end?: string | null;
  credit: number | null; 
  created_at: string | null;
};

type ResponsePost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'answer';
  user_id: string;
  request_id?: string;
  created_at: string | null;
  credit: number | null;
};

type UnifiedPost = RequestPost | ResponsePost;

type FilterType = 'all' | 'question' | 'answer';

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'question', label: '질문' },
  { key: 'answer', label: '답변' },
];

const AllPostsPage = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        setError('유저 정보가 없습니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [requestData, responseData] = await Promise.all([
          supabase
            .from('request_posts')
            .select(
              'id, title, content, country_city, category, img_url, user_id, date_end, credit, created_at',
            )
            .eq('user_id', user.id),
          supabase
            .from('response_posts')
            .select('id, title, content_html, request_id, user_id, created_at')
            .eq('user_id', user.id),
        ]);

        const formattedPosts: UnifiedPost[] = [
          ...(requestData.data || []).map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content || '',
            type: 'question' as const,
            img_url: post.img_url || [],
            country_city: post.country_city || '',
            category: convertTopicsToKorean(post.category || []),
            user_id: post.user_id,
            date_end: post.date_end || null,
            credit: post.credit || null, 
            created_at: post.created_at || null,
          })),
          ...(responseData.data || []).map((post) => ({
            id: post.id,
            title: post.title,
            content: stripHtmlTags(post.content_html) || '',
            type: 'answer' as const,
            img_url: [],
            country_city: '', 
            category: [], 
            user_id: post.user_id,
            created_at: post.created_at || null,
            request_id: post.request_id,
            credit: null, 
          })),
        ];

        setPosts(formattedPosts);
      } catch (err) {
        setError('알 수 없는 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  const filteredPosts = posts.filter((post) =>
    activeFilter === 'all' ? true : post.type === activeFilter,
  );

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      <CategoryTabs activeTab="written" />

      <div
        className="inline-flex items-start gap-[4px] mt-[16px]"
        style={{
          width: '100%',
          paddingLeft: '20px',
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex items-center justify-center px-[16px] py-[12px] h-[36px] rounded-full ${
              activeFilter === filter.key
                ? 'border-[#000] bg-[#000] text-[#FFF]'
                : 'border-[#DFE1E5] bg-transparent text-[#000]'
            }`}
            style={{
              borderWidth: '1px',
              fontFamily: 'Pretendard',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '19.6px',
              letterSpacing: '-0.28px',
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div
        className="overflow-y-auto"
        style={{
          height: 'calc(100vh - 190px)',
          paddingBottom: '50px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) =>
            post.type === 'question' ? (
              <RequestPostCard key={post.id} post={post as RequestPost} />
            ) : (
              <ResponsePostCard key={post.id} post={post as ResponsePost} />
            ),
          )
        ) : (
          <div className="text-center text-gray-500">게시물이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AllPostsPage;

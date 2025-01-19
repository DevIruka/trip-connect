'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import CategoryTabs from '../../_components/CategoryTabs';
import stripHtmlTags from '../../_util/striptHtmlTags';

type UnifiedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'question' | 'answer';
  user_id: string;
  request_id?: string;
  date_end?: string | null;
  credit?: number | null;
  created_at: string | null;
};

const AllPostsPage = () => {
  const { user } = useUserStore(); // 사용자 정보 가져오기
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'question' | 'answer'
  >('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 중복 제거 함수
  const uniquePosts = (posts: UnifiedPost[]): UnifiedPost[] => {
    const seen = new Set();
    return posts.filter((post) => {
      const duplicate = seen.has(post.id);
      seen.add(post.id);
      return !duplicate;
    });
  };

  // 데이터 가져오기
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

        const formattedPosts: UnifiedPost[] = uniquePosts([
          ...(requestData.data || []).map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content || '',
            type: 'question' as const,
            img_url: post.img_url || [],
            country_city: post.country_city || '',
            category: post.category || [],
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
          })),
        ]);

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

  // 필터된 게시물 계산
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
      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="written" />

      {/* 필터 탭 */}
      <div className="flex gap-4">
        <button onClick={() => setActiveFilter('all')}>전체</button>
        <button onClick={() => setActiveFilter('question')}>질문</button>
        <button onClick={() => setActiveFilter('answer')}>답변</button>
      </div>

      {/* 게시물 렌더링 */}
      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg mb-4">
              <h3 className="text-lg font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <p className="text-sm text-gray-400">
                {post.type === 'question' ? '질문' : '답변'}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">게시물이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default AllPostsPage;

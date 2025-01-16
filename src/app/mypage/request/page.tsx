'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import UserProfileSection from '../_components/UserProfileSection';
import CategoryTabs from '../_components/CategoryTabs';
import FilterTabs from '../_components/FilterTabs';
import PostCard from '../_components/PostCard';

type Post = {
  id: string;
  title: string;
  content: string;
  content_html?: string;
  country_city?: string;
  category: string;
  img_url: string[];
  request_id?: string;
};

type FilterType = 'all' | 'question' | 'answer';

const RequestPage = () => {
  const { user } = useUserStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        setError('사용자 정보가 없습니다. 로그인해주세요.');
        setLoading(false);
        return;
      }

      try {
        const [requestData, responseData] = await Promise.all([
          supabase
            .from('request_posts')
            .select('id, title, content, country_city, category, img_url')
            .eq('user_id', user.id),
          supabase
            .from('response_posts')
            .select('id, title, content_html, created_at, request_id')
            .eq('user_id', user.id),
        ]);

        if (requestData.error || responseData.error) {
          setError('데이터를 가져오는 중 문제가 발생했습니다.');
          console.error(requestData.error || responseData.error);
          return;
        }

        const formattedPosts = [
          ...requestData.data.map((post) => ({
            ...post,
            category: '질문',
            content_html: undefined,
            request_id: undefined,
          })),
          ...responseData.data.map((post) => ({
            ...post,
            category: '답변',
            content: post.content_html || '',
            country_city: '',
            img_url: [],
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
  }, [user]);

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'question') return post.category === '질문';
    if (activeFilter === 'answer') return post.category === '답변';
    return false;
  });

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 */}
      <UserProfileSection />

      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="written" />

      {/* 작성글 필터링 탭 */}
      <FilterTabs
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
      />

      {/* 게시글 목록 */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            type={post.category === '질문' ? 'request' : 'response'}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">게시물이 없습니다.</div>
      )}
    </div>
  );
};

export default RequestPage;

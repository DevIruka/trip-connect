'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import FilterTabs from '../../_components/FilterTabs';
import PostCard from '../../_components/PostCard';
import CategoryTabs from '../../_components/CategoryTabs';
import UserProfileSection from '../../_components/UserProfileSection';


type UnifiedPost = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'question' | 'answer';
  request_id?: string; 
};

const AllPostsPage = () => {
  const { user } = useUserStore(); 
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'question' | 'answer'
  >('all');
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
              'id, title, content, country_city, category, img_url, user_id',
            )
            .eq('user_id', user.id),
          supabase
            .from('response_posts')
            .select('id, title, content_html, request_id, user_id') 
            .eq('user_id', user.id),
        ]);

        if (requestData.error || responseData.error) {
          setError('데이터를 가져오는 중 문제가 발생했습니다.');
          return;
        }

        const formattedPosts: UnifiedPost[] = [
          ...(requestData.data || []).map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            type: 'question' as const, 
            img_url: post.img_url || [],
            country_city: post.country_city || '',
            category: post.category || [],
          })),
          ...(responseData.data || []).map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content_html || '',
            type: 'answer' as const, 
            img_url: [],
            country_city: '',
            category: [],
            request_id: post.request_id, 
          })),
        ];

        setPosts(formattedPosts);
      } catch (err) {
        console.error('데이터 가져오기 오류:', err);
        setError('알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    return post.type === activeFilter;
  });

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 추가 */}
      <UserProfileSection />

      <CategoryTabs activeTab="written" />
      <FilterTabs
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
      />
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center text-gray-500">게시물이 없습니다.</div>
      )}
    </div>
  );
};

export default AllPostsPage;

'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import UserProfileSection from '../_components/UserProfileSection';
import CategoryTabs from '../_components/CategoryTabs';
import PostCard from '../_components/PostCard';

type ResponsePost = {
  id: string;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string | null;
  request_id?: string; 
};

const PurchasedPage = () => {
  const { user } = useUserStore();
  const [purchasedPosts, setPurchasedPosts] = useState<ResponsePost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPurchasedAnswers = async () => {
      if (!user?.id) {
        setError('사용자 정보가 없습니다. 로그인 해주세요.');
        setLoading(false);
        return;
      }

      try {
        const { data: purchasedData, error: purchasedError } = await supabase
          .from('purchased_users')
          .select('response_id')
          .eq('user_id', user.id);

        if (purchasedError) {
          console.error('구매 데이터 오류:', purchasedError);
          setError('구매 데이터를 가져오는 중 문제가 발생했습니다.');
          setLoading(false);
          return;
        }

        if (!purchasedData || purchasedData.length === 0) {
          setError('구매한 답변이 없습니다.');
          setLoading(false);
          return;
        }

        const responseIds = purchasedData.map((item) => item.response_id);

        const { data: responsePostsData, error: responsePostsError } =
          await supabase
            .from('response_posts')
            .select('id, title, content_html, created_at, user_id, request_id') // request_id 포함
            .in('id', responseIds);

        if (responsePostsError) {
          console.error('응답 데이터 오류:', responsePostsError);
          setError('응답 데이터를 가져오는 중 문제가 발생했습니다.');
          setLoading(false);
          return;
        }

        setPurchasedPosts(responsePostsData || []);
      } catch (e) {
        console.error('알 수 없는 오류:', e);
        setError('알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedAnswers();
  }, [user]);

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
      <CategoryTabs activeTab="purchased" />

      {/* 구매한 답변 글 목록 */}
      {purchasedPosts.length > 0 ? (
        <ul className="space-y-4">
          {purchasedPosts.map((post) => (
            <li key={post.id}>
              <PostCard
                post={{
                  id: post.id,
                  title: post.title,
                  content: post.content_html,
                  category: '답변',
                  img_url: [],
                  request_id: post.request_id || undefined,
                }}
                type="response"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">구매한 답변이 없습니다.</p>
      )}
    </div>
  );
};

export default PurchasedPage;

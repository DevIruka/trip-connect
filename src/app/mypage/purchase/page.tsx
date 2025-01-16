'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import PostCard from '../_components/PostCard';


type ResponsePost = {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string | null;
  request_id: string | null;
};

const PurchasedPage = () => {
  const { user } = useUserStore(); 
  const [purchasedPosts, setPurchasedPosts] = useState<ResponsePost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchasedPosts = async () => {
      if (!user?.id) {
        console.error('User not found');
        return;
      }


      try {
        const { data: purchasedData, error: purchasedError } = await supabase
          .from('purchased_users')
          .select('response_id')
          .eq('user_id', user.id);

        if (purchasedError) {
          setError('구매한 글을 가져오는 중 문제가 발생했습니다.');
          return;
        }

        console.log('Purchased Users Data:', purchasedData);

        if (!purchasedData || purchasedData.length === 0) {
          return;
        }

        const responseIds = purchasedData.map((item) => item.response_id);

        const { data: responsePostsData, error: responsePostsError } =
          await supabase
            .from('response_posts')
            .select('id, title, content_html, created_at, user_id, request_id')
            .in('id', responseIds);

        if (responsePostsError) {
          console.error('Error fetching response posts:', responsePostsError);
          return;
        }

        console.log('Fetched response posts:', responsePostsData);

        setPurchasedPosts(responsePostsData || []);
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('알 수 없는 오류가 발생했습니다.');
      }
    };

    fetchPurchasedPosts();
  }, [user]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 구매한 글 목록 */}
      {purchasedPosts.length > 0 ? (
        purchasedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id.toString(),
              title: post.title,
              content: post.content_html,
              country_city: '',
              category: '구매',
              img_url: [], 
            }}
            onDelete={() => {}}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">구매한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default PurchasedPage;

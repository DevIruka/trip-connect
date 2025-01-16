'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import PostCard from '../../_components/PostCard';

type UnifiedPost = {
  id: string; 
  title: string;
  content: string;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'answer'; 
  request_id: string; 
};

const AnswerPostsPage = () => {
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('response_posts')
          .select('id, title, content_html, country_city, img_url, request_id');

        if (error) {
          setError('답변 데이터를 가져오는 중 문제가 발생했습니다.');
          return;
        }

        if (!data) {
          setError('데이터가 비어 있습니다.');
          return;
        }

        const formattedPosts: UnifiedPost[] = data.map((post) => ({
          id: post.id.toString(), 
          title: post.title,
          content: post.content_html || '',
          type: 'answer', 
          img_url: post.img_url || [], 
          country_city: post.country_city || '', 
          category: [], 
          request_id: post.request_id,
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error('데이터 가져오기 오류:', err);
        setError('알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="px-5 space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center text-gray-500">답변이 없습니다.</div>
      )}
    </div>
  );
};

export default AnswerPostsPage;

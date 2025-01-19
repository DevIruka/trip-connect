'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore'; // 유저 스토어 추가
import ResponseContent from '../../_components/ResponseContent';

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
  const { user } = useUserStore(); // 유저 정보 가져오기
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        setError('유저 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('response_posts')
          .select('id, title, content_html, country_city, img_url, request_id')
          .eq('user_id', user.id); // 유저 ID로 필터링

        if (error) {
          setError('답변 데이터를 가져오는 중 문제가 발생했습니다.');
          return;
        }

        if (!data || data.length === 0) {
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
  }, [user?.id]);

  if (loading)
    return <div className="text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="px-5 space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="border-b-2 pb-4">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <ResponseContent html={post.content} />
            <p className="text-sm text-gray-600">
              {post.country_city || '지역 정보 없음'}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">답변이 없습니다.</div>
      )}
    </div>
  );
};

export default AnswerPostsPage;

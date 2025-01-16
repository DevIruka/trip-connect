'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import PostCard from '../../_components/PostCard';

type ResponsePost = {
  id: string;
  title: string;
  content_html: string;
  created_at: string;
  request_id: string | null; 
};

const Answers = () => {
  const { user } = useUserStore();
  const [responsePosts, setResponsePosts] = useState<ResponsePost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!user?.id) {
        setError('사용자 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('response_posts')
          .select('id, title, content_html, created_at, request_id')
          .eq('user_id', user.id);

        if (error) {
          setError('답변 글을 가져오는 중 문제가 발생했습니다.');
          console.error('Error fetching answers:', error);
        } else {
          setResponsePosts(data || []);
        }
      } catch (err) {
        setError('답변 글을 가져오는 중 알 수 없는 오류가 발생했습니다.');
        console.error('Unexpected error fetching answers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [user]);

  if (loading)
    return <div className="text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {responsePosts.length > 0 ? (
        responsePosts.map((post) => (
          <PostCard
            key={post.id}
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
        ))
      ) : (
        <div className="text-center text-gray-500">답변한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default Answers;

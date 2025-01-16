'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import PostCard from '../../_components/PostCard';

type ResponsePost = {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string | null;
  request_id: string | null;
};

const Answers = () => {
  const { user } = useUserStore(); 
  const [responsePosts, setResponsePosts] = useState<ResponsePost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!user?.id) return; 

      try {
        const { data: responseData, error: responseError } = await supabase
          .from('response_posts')
          .select('id, title, content_html, created_at, user_id, request_id')
          .eq('user_id', user.id); 

        if (responseError) {
          console.error('Error fetching response posts:', responseError);
          setError('응답 글을 가져오는 중 문제가 발생했습니다.');
          return;
        }

        setResponsePosts(responseData || []);
      } catch (e) {
        console.error('Unexpected error:', e);
        setError('알 수 없는 오류가 발생했습니다.');
      }
    };

    fetchResponses();
  }, [user]); 

  const handleDeleteResponse = async (responseId: number) => {
    try {
      const { error } = await supabase
        .from('response_posts')
        .delete()
        .eq('id', responseId);

      if (error) {
        console.error('Error deleting response post:', error);
        return;
      }

      setResponsePosts((prev) =>
        prev.filter((response) => response.id !== responseId),
      );
    } catch (e) {
      console.error('Unexpected error while deleting response post:', e);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {responsePosts.length > 0 ? (
        responsePosts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id.toString(),
              title: post.title,
              content: post.content_html,
              country_city: '',
              category: '답변',
              img_url: [],
            }}
            onDelete={() => handleDeleteResponse(post.id)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">응답한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default Answers;

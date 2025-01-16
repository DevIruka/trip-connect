'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import PostCard from '../../_components/PostCard';

type RequestPost = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string;
  img_url: string[];
};

type ResponsePost = {
  id: string;
  title: string;
  content_html: string;
  created_at: string;
  request_id: string | null;
};

const AllPosts = () => {
  const { user } = useUserStore();
  const [filteredPosts, setFilteredPosts] = useState<
    (RequestPost | ResponsePost)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (!user?.id) {
        setError('사용자 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const { data: requestData, error: requestError } = await supabase
          .from('request_posts')
          .select('id, title, content, country_city, category, img_url')
          .eq('user_id', user.id);

        if (requestError) {
          console.error('Error fetching request posts:', requestError);
          setError('질문 글을 가져오는 중 문제가 발생했습니다.');
          return;
        }

        const { data: responseData, error: responseError } = await supabase
          .from('response_posts')
          .select('id, title, content_html, created_at, request_id')
          .eq('user_id', user.id);

        if (responseError) {
          console.error('Error fetching response posts:', responseError);
          setError('답변 글을 가져오는 중 문제가 발생했습니다.');
          return;
        }

        const combinedData = [...(requestData || []), ...(responseData || [])];

        setFilteredPosts(combinedData);
      } catch (err) {
        console.error('Unexpected error fetching all posts:', err);
        setError('전체 글을 가져오는 중 알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [user]);

  if (loading)
    return <div className="text-center text-gray-500">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={
              'content_html' in post
                ? {
                    id: post.id,
                    title: post.title,
                    content: post.content_html,
                    country_city: '',
                    category: '답변',
                    img_url: [],
                  }
                : {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    country_city: post.country_city,
                    category: post.category,
                    img_url: post.img_url,
                  }
            }
            type={'content_html' in post ? 'response' : 'request'}
          />
        ))
      ) : (
        <div className="text-center text-gray-500">작성한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default AllPosts;

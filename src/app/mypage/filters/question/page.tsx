'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore'; // 유저 스토어 추가
import PostCard from '../../_components/PostCard';

type UnifiedPost = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string[];
  img_url: string[];
  type: 'question';
};

const QuestionPostsPage = () => {
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
          .from('request_posts')
          .select('id, title, content, country_city, category, img_url')
          .eq('user_id', user.id); // 유저 ID로 필터링

        if (error) {
          setError('질문 데이터를 가져오는 중 문제가 발생했습니다.');
          return;
        }

        const formattedPosts: UnifiedPost[] = (data || []).map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          type: 'question',
          img_url: post.img_url || [],
          country_city: post.country_city || '',
          category: post.category || [],
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center text-gray-500">질문이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default QuestionPostsPage;

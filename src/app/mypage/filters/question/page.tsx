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
  type: 'question';
};

const QuestionPostsPage = () => {
  const [posts, setPosts] = useState<UnifiedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from('request_posts')
          .select('id, title, content, country_city, category, img_url');

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
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default QuestionPostsPage;

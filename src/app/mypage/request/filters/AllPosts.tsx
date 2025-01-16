'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import PostCard from '../../_components/PostCard';


type Post = {
  id: string;
  title: string;
  content: string;
  country_city: string;
  category: string;
  img_url: string[];
};

const AllPosts = () => {
  const { user } = useUserStore();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const { data: allPostsData, error: allPostsError } = await supabase
          .from('request_posts')
          .select('id, title, content, country_city, category, img_url')
          .eq('user_id', user?.id); 

        if (allPostsError) {
          console.error('Error fetching all posts:', allPostsError);
          setError('전체 글을 가져오는 중 문제가 발생했습니다.');
          return;
        }

        setFilteredPosts(allPostsData || []); 
      } catch (fetchError) {
        console.error('Unexpected error fetching all posts:', fetchError);
        setError('전체 글을 가져오는 중 문제가 발생했습니다.');
      }
    };

    fetchAllPosts();
  }, [user]); 

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onDelete={() => {}} />
        ))
      ) : (
        <div className="text-center text-gray-500">작성한 글이 없습니다.</div>
      )}
    </div>
  );
};

export default AllPosts;

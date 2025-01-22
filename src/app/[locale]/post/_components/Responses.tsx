'use client';
import { supabase } from '@/utils/supabase/supabaseClient';

import { useEffect, useState } from 'react';
import { Tables } from '@/types/supabase';

import Response from './Response';

const Responses = ({ postId }: { postId: string }) => {
  const [resPosts, setResPosts] = useState<Tables<'response_posts'>[] | null>();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: response_posts } = await supabase
        .from('response_posts')
        .select('*')
        .eq('request_id', postId);
      setResPosts(response_posts);
    };
    fetchPosts();
  }, [postId]);

  return (
    <>
      <div className="flex items-center p-5 text-[#44484c] text-base font-semibold leading-snug">
        <div className="text-[#0582ff]">{resPosts?.length}</div>개의 답변이
        있어요
      </div>
      <div className="border-b border-[#f3f3f3]"></div>

      {resPosts
        ? resPosts.map((post) => {
            return <Response key={post.id} post={post} />;
          })
        : '게시물이 없어요'}
    </>
  );
};

export default Responses;

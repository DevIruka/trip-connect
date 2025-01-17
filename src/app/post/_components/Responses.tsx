'use client';
import { supabase } from '@/utils/supabase/supabaseClient';
import RenderTranslatedHTML from './RenderTranslatedHTML';
import Profile from './profile';
import { useEffect, useState } from 'react';
import { useGPTTranslation } from '../_hooks/TranslatedText';
import { Tables } from '@/types/supabase';

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

  const text = resPosts ? resPosts[0]?.content_html : '';
  const title = resPosts ? resPosts[0]?.title : '';
  const { data: translatedText, isPending: isTextLoading } = useGPTTranslation(
    `${postId}text`,
    text,
  );
  const { data: translatedTitle, isPending: isTitleLoading } =
    useGPTTranslation(`${postId}title`, title);
  if (isTextLoading || isTitleLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="h-12 flex items-center px-5">
        {resPosts?.length}개의 답변이 있어요
      </div>
      <div className="border-b-2"></div>

      {resPosts?.map((post) => {
        return (
          <div key={post.id} className="px-5 py-5 mb-5">
            <Profile postUserId={post.user_id} />
            <div>
              <div className="h-12 grid items-center justify-start">
                <RenderTranslatedHTML data={JSON.parse(translatedTitle!)} />
                <button className="border-2">원문보기</button>
              </div>
              <RenderTranslatedHTML
                data={{ original: '', translated: post.free_content! }}
              />
              <RenderTranslatedHTML data={JSON.parse(translatedText!)} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Responses;

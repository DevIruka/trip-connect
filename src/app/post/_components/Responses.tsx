'use client';
import { supabase } from '@/utils/supabase/supabaseClient';
import RenderTranslatedHTML from './RenderTranslatedHTML';
import Profile from './profile';
import { useEffect, useState } from 'react';
import { useGPTTranslation } from '../_hooks/TranslatedText';

const Responses = ({ postId }: { postId: string }) => {
  const [resPosts, setResPosts] = useState();
  useEffect(() => {
    const fetchPosts = async () => {
      const { data: response_posts } = await supabase
        .from('response_posts')
        .select('*')
        .eq('request_id', postId);
      setResPosts(response_posts);
    };
    fetchPosts();
  }, []);

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

  console.log(translatedTitle);

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
              <div dangerouslySetInnerHTML={{ __html: post.free_content! }} />
              <RenderTranslatedHTML data={JSON.parse(translatedText!)} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Responses;

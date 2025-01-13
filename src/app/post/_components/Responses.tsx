'use client';

import React from 'react';
import { useResPosts } from '../_hooks/useResPosts';
import useTranslate from '../_hooks/useTranslate';
import RenderTranslatedHTML from './RenderTranslatedHTML';

const Responses = ({ postId }: { postId: string }) => {
  const { data: response_posts } = useResPosts(postId);
  const text = response_posts ? response_posts[0]?.content_html : '';
  const title = response_posts ? response_posts[0]?.title : '';
  const {
    data: translatedText,
    isLoading: isTransLoading,
    error: transError,
  } = useTranslate(text);

  const { data: translatedTitle } = useTranslate(title);

  if (isTransLoading) return <div>번역 중...</div>;
  if (transError) return <div>에러 발생: {(transError as Error).message}</div>;

  return (
    <>
      <div className="h-12 border-b-2">
        {response_posts?.length}개의 답변이 있어요
      </div>
      {response_posts?.map((post) => (
        <div key={post.id}>
          <div className="h-12 flex items-center">
            <RenderTranslatedHTML data={JSON.parse(translatedTitle)} />
          </div>
          <RenderTranslatedHTML data={JSON.parse(translatedText)} />
        </div>
      ))}
    </>
  );
};

export default Responses;

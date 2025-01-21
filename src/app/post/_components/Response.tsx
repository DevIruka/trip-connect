'use client';
import React, { useEffect, useState } from 'react';
import Profile from './profile';
import Image from 'next/image';

import original from '@/data/images/original.svg';
import comment from '@/data/images/ic-comment.svg';
import updown from '@/data/images/ic-up&down.svg';
import MoreButton from '@/data/images/ic-More.svg';
import { useGPTTranslation } from '../_hooks/TranslatedText';
import RenderTranslatedHTML from './RenderTranslatedHTML';
import { Tables } from '@/types/supabase';

const Response = ({ post }: { post: Tables<'response_posts'> }) => {
  const [isContentVisible, setContentVisible] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // 구매 여부 상태
  const [credits, setCredits] = useState(10); // 사용자 크레딧
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOriginal, setIsOriginal] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { data: translatedTitle } = useGPTTranslation(
    `${post.id}title`,
    `${post.title}`,
  );
  const { data: translatedFreeText } = useGPTTranslation(
    `
  ${post.id}freetext`,
    `${post.free_content}`,
  );
  const { data: translatedText } = useGPTTranslation(
    `${post.id}text`,
    post.content_html,
  );

  const handlePurchase = () => {
    if (credits > 0) {
      setCredits((prev) => prev - 1); // 크레딧 차감
      setIsPurchased(true); // 구매 완료 상태
    } else {
      alert('크레딧이 부족합니다. 크레딧을 충전해주세요.');
    }
  };

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
  };
  if (!isHydrated) {
    return <div>로딩중</div>;
  }
  return (
    <div key={post.id}>
      <Profile postUserId={post.user_id} />
      <div className="px-5">
        <div>
          <div className="grid my-2 text-black text-lg font-bold leading-[28.80px]">
            {!isOriginal ? (
              translatedTitle ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: JSON.parse(translatedTitle).translated,
                  }}
                />
              ) : (
                '제목로딩중'
              )
            ) : (
              post.title
            )}
          </div>
          <button
            onClick={() => setIsOriginal(!isOriginal)}
            className="h-6 px-2 py-1 rounded-[14px] border border-[#c5c8cc] justify-center items-center gap-1 inline-flex text-[#44484c] text-xs font-medium mb-5"
          >
            <Image src={original} alt="original" height={14} width={14} />
            {!isOriginal ? '원문보기' : '번역보기'}
          </button>
          <div className="grid gap-4">
            <div className="text-[#44484c] text-base font-medium leading-relaxed">
              {!isOriginal ? (
                translatedFreeText ? (
                  <RenderTranslatedHTML data={JSON.parse(translatedFreeText)} />
                ) : (
                  '공짜내용로딩중'
                )
              ) : (
                <RenderTranslatedHTML
                  data={{ original: '', translated: post.free_content }}
                />
              )}
            </div>
            {isContentVisible && (
              <div className="text-[#44484c] text-base font-medium leading-relaxed pb-[18px]">
                {!isOriginal ? (
                  translatedText ? (
                    <RenderTranslatedHTML data={JSON.parse(translatedText)} />
                  ) : (
                    '유료내용로딩중'
                  )
                ) : (
                  <RenderTranslatedHTML
                    data={{ original: '', translated: post.content_html }}
                  />
                )}
              </div>
            )}
          </div>
          {!isPurchased ? (
            // 구매 버튼
            <button
              onClick={handlePurchase}
              className="w-full h-11 bg-[#eaf4ff] rounded-[10px] justify-center items-center gap-2.5 inline-flex my-2.5 text-[#0079f2] text-sm font-semibold"
            >
              구매하고 전체보기
            </button>
          ) : (
            // 콘텐츠 보기 버튼
            <button
              onClick={toggleContent}
              className="w-full h-11 px-3 py-1.5 rounded-[100px] border border-[#dee1e5] justify-center items-center gap-1 inline-flex my-2.5 text-center text-[#44484c] text-sm font-semibold"
              disabled={!translatedText}
            >
              {isContentVisible ? '접기' : '펼쳐 보기'}
              <Image
                width={18}
                height={18}
                src={updown}
                alt="updown"
                className={`transform ${isContentVisible ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>
        <div className="border-t border-[#dee1e5] p-4 flex place-content-between">
          <div className="flex gap-1 text-[#44484c] text-xs font-bold leading-none items-center">
            <Image width={20} height={20} src={comment} alt="comment" />0
          </div>
          <Image width={20} height={20} src={MoreButton} alt="MoreButton" />
        </div>
      </div>
      <div className="h-[5px] bg-[#f4f6f9] z-50"></div>
    </div>
  );
};
export default Response;

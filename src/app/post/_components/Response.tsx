'use client';
import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import Image from 'next/image';
import * as Sentry from '@sentry/nextjs';

import original from '@/data/images/original.svg';
import comment from '@/data/images/ic-comment.svg';
import updown from '@/data/images/ic-up&down.svg';
import MoreButton from '@/data/images/ic-More.svg';
import RenderTranslatedHTML from './RenderTranslatedHTML';
import { Tables } from '@/types/supabase';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import SelectBox from '@/components/SelectBox';
import { useRouter } from 'next/navigation';
import translate from '@/data/images/translate.svg';
import { useModal } from '@/providers/ModalProvider';
import { useReviewCount } from '@/utils/api/tanstack/home/useReviewCount';
import { useLang } from '@/store/languageStore';
import { useTranslation } from 'react-i18next';

const Response = ({ post }: { post: Tables<'response_posts'> }) => {
  const [isContentVisible, setContentVisible] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // 구매 여부 상태
  const [mycredits, setMycredits] = useState<number | null>(); // 사용자 크레딧
  const [credit, setCredit] = useState();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOriginal, setIsOriginal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useUserStore();
  const router = useRouter();
  const { openModal } = useModal();
  const { t } = useTranslation('post');

  //언어 설정에 따라 원문/번역보기 default값 정하기
  const { lang } = useLang();
  useEffect(() => {
    if (lang === 'en') setIsOriginal(true);
    if (lang === 'ko') setIsOriginal(false);
  }, [lang]);

  //리뷰 갯수
  const { reviewCount } = useReviewCount(post.id);

  //mycredits: 로그인한 유저의 보유 크레딧 가져오기
  const fetchLoginuserData = async () => {
    if (!user) return;
    try {
      const { data: loginUserData } = await supabase
        .from('users')
        .select('credit')
        .eq('id', user.id)
        .single();
      setMycredits(loginUserData?.credit);
    } catch (fetchError) {
      console.error('Unexpected error:', fetchError);
    }
  };

  //credit: 게시물 가격(크레딧) 가져오기
  const fetchRequestData = async () => {
    const { data: requestData } = await supabase
      .from('request_posts')
      .select('credit')
      .eq('id', post.request_id)
      .single();
    setCredit(requestData?.credit);
  };

  //구매가 되어 있는지 확인하기
  const fetchPurchased = async () => {
    const { data, error } = await supabase
      .from('purchased_users')
      .select('*')
      .eq('user_id', user?.id)
      .eq('response_id', post.id)
      .maybeSingle();
    if (data) setIsPurchased(true);
    if (error) console.log(error.message);
  };

  //구매 시 데이터 넣어주기
  const fetchPurchasing = async () => {
    await supabase
      .from('purchased_users')
      .insert([{ user_id: user?.id, response_id: post.id }])
      .select();
    setIsPurchased(true);
  };

  //구매 시 크레딧 차감하기
  const minusCredit = async () => {
    try {
      const response = await supabase
        .from('users')
        .update({ credit: mycredits! - credit! })
        .eq('id', user?.id)
        .select();
      if (!response) {
        throw new Error('크레딧 차감에 실패하였습니다.');
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    fetchLoginuserData();
    fetchRequestData();
    fetchPurchased(); // 구매 상태 확인
  }, []);

  const handlePurchase = () => {
    if (!user) openModal('loginModal');
    else if (!mycredits || mycredits < credit!) openModal('chargeModal');
    else if (mycredits >= credit!) {
      setMycredits((prev) => prev! - credit!); // 크레딧 차감
      fetchPurchasing();
      minusCredit();
    } else {
      openModal('chargeModal');
    }
  };

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
  };
  if (!isHydrated) {
    return <div>로딩중</div>;
  }
  return (
    <div
      key={post.id}
      className="md:border md:border-Gray5Line md:mb-5 md:rounded-2xl md:w-[760px]"
    >
      <Profile postUserId={post.user_id} createdAt={post.created_at} />
      <div className="px-5">
        <div>
          <div className="grid my-2 text-black text-lg font-bold leading-[28.80px]">
            {!isOriginal ? (
              <p
                dangerouslySetInnerHTML={{
                  __html: post.translated_title!,
                }}
              />
            ) : (
              post.title
            )}
          </div>
          <button
            onClick={() => setIsOriginal(!isOriginal)}
            className={`h-6 px-2 py-1 rounded-[14px] border justify-center items-center gap-1 inline-flex text-xs font-medium mb-5 ${
              !isOriginal
                ? 'border-[#c5c8cc] text-[#44484c]'
                : 'border-Blue3 text-Blue1'
            }`}
          >
            {!isOriginal ? (
              <Image src={original} alt="original" height={14} width={14} />
            ) : (
              <Image src={translate} alt="translate" height={14} width={14} />
            )}
            {!isOriginal ? t('original') : t('translate')}
          </button>
          <div className="grid gap-4">
            <div className="text-[#44484c] text-base font-medium leading-relaxed">
              {!isOriginal ? (
                <RenderTranslatedHTML
                  data={{
                    original: '',
                    translated: post.translated_free_content!,
                  }}
                />
              ) : (
                <RenderTranslatedHTML
                  data={{ original: '', translated: post.free_content }}
                />
              )}
            </div>
            {isContentVisible && (
              <div className="text-[#44484c] text-base font-medium leading-relaxed pb-[18px]">
                {!isOriginal ? (
                  <RenderTranslatedHTML
                    data={{
                      original: '',
                      translated: post.translated_content!,
                    }}
                  />
                ) : (
                  <RenderTranslatedHTML
                    data={{ original: '', translated: post.content_html }}
                  />
                )}
              </div>
            )}
          </div>
          {!isPurchased && user?.id !== post.user_id ? (
            // 구매 버튼
            <button
              onClick={handlePurchase}
              className="w-full h-11 bg-[#eaf4ff] rounded-[10px] justify-center items-center gap-2.5 inline-flex my-2.5 text-[#0079f2] text-sm font-semibold"
            >
              {t('buy')}
            </button>
          ) : (
            // 콘텐츠 보기 버튼
            <button
              onClick={toggleContent}
              className="w-full h-11 px-3 py-1.5 rounded-[100px] border border-[#dee1e5] justify-center items-center gap-1 inline-flex my-2.5 text-center text-[#44484c] text-sm font-semibold"
              disabled={!post.translated_content}
            >
              {isContentVisible
                ? t('summarize')
                : !post.translated_content
                ? t('loading')
                : t('see_more')}
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
          <div
            className="flex gap-1 text-[#44484c] text-xs font-bold leading-none items-center cursor-pointer"
            onClick={() => router.push(`/review/${post.id}`)}
          >
            <Image width={20} height={20} src={comment} alt="comment" />
            {reviewCount}
          </div>
          <div
            className="relative"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            {isModalOpen && (
              <SelectBox user={user!} responsePost={post!} mode="response" />
            )}

            <button onClick={() => setIsModalOpen(true)}>
              <Image width={20} height={20} src={MoreButton} alt="MoreButton" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-[5px] bg-[#f4f6f9] z-50 md:bg-transparent"></div>
    </div>
  );
};
export default Response;

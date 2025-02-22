'use client';
import { useModal } from '@/providers/ModalProvider';
import { useUserStore } from '@/store/userStore';
import { Tables } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ResponseBtn = ({ post }: { post: Tables<'request_posts'> }) => {
  const { user } = useUserStore();
  const router = useRouter();

  const today = new Date(); // 현재 날짜
  const postEndDate = new Date(post.date_end!); // post의 종료 날짜
  const isExpired = postEndDate < today; // 만료 여부

  const handleNavigation = (postId: string) => {
    router.push(`/response/${postId}`);
  };
  const { openModal } = useModal();
  const { t } = useTranslation('post');

  return (
    <>
      <div className="bg-white z-50 fixed bottom-0 w-full max-w-[800px] md:flex md:justify-center md:bg-transparent md:mb-20">
        <div
          className={`blue-btn cursor-pointer md:w-[324px] md:h-16 md:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.14)] md:rounded-[100px] md:justify-center md:items-center md:text-xl md:font-bold ${
            isExpired ? 'bg-Gray4Icon text-white cursor-default' : ''
          }`}
          onClick={() => {
            if (isExpired) return;
            if (user) {
              handleNavigation(post.id);
            } else {
              openModal('loginModal');
            }
          }}
        >
          {isExpired ? t('expired') : t('answer')}
        </div>
      </div>
    </>
  );
};

export default ResponseBtn;

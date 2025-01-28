'use client';
import { useModal } from '@/providers/ModalProvider';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ResponseBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const router = useRouter();
  const handleNavigation = (postId: string) => {
    router.push(`/response/${postId}`);
  };
  const { onOpen } = useModal();

  return (
    <>
      <div className="bg-white z-50 fixed bottom-0 w-[375px] cursor-pointer">
        <div
          className="blue-btn"
          onClick={() => {
            if (user) {
              handleNavigation(postId);
            } else {
              onOpen();
            }
          }}
        >
          답변하기
        </div>
      </div>
    </>
  );
};

export default ResponseBtn;

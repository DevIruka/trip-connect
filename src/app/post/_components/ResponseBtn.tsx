'use client';
import LoginModal from '@/components/LoginModal';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ResponseBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleNavigation = (postId: string) => {
    router.push(`/response/${postId}`);
  };

  return (
    <>
      <div className="bg-white z-50 fixed bottom-0 w-[375px] cursor-pointer">
        <div
          className="blue-btn"
          onClick={() => {
            if (user) {
              handleNavigation(postId);
            } else {
              setIsModalOpen(true);
            }
          }}
        >
          답변하기
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ResponseBtn;

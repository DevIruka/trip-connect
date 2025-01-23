'use client';
import LoginModal from '@/components/LoginModal';
import { useUserStore } from '@/store/userStore';
import React, { useState } from 'react';

const ResponseBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="bg-white z-50 fixed bottom-0 w-[375px]">
        <div
          className="blue-btn"
          onClick={() => {
            if (user) {
              location.href = `/response/${postId}`;
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

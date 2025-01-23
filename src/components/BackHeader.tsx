'use client';
import React, { useState } from 'react';
import BackButton from '../app/post/_components/BackBtn';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import DeleteConfirmModal from '@/app/post/_components/DeleteConfirmModal';
import { Tables } from '@/types/supabase';

const BackHeader = ({
  image,
  imagesize,
  text,
  isThreeDots,
  post,
}: {
  image: string;
  imagesize: number;
  text: string;
  isThreeDots?: boolean;
  post?: Tables<'request_posts'>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDModalOpen, setIsDModalOpen] = useState(false);

  const { user } = useUserStore();

  return (
    <>
      <div className="h-14 px-5 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white">
        <BackButton />
        <div className="text-center text-black text-lg font-semibold">
          {text}
        </div>
        {isThreeDots ? (
          <button onClick={() => setIsModalOpen(true)}>
            <Image
              width={imagesize}
              height={imagesize}
              alt={image}
              src={image}
            />
          </button>
        ) : (
          <Image width={imagesize} height={imagesize} alt={image} src={image} />
        )}

        {isModalOpen && (
          <div
            className="w-full h-screen absolute top-0 right-0 cursor-pointer"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <div className="bg-white grid w-[129px] rounded-lg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)] text-center p-2.5 justify-start items-center gap-1 absolute top-[45px] right-[23px] text-[#44484c] text-sm font-medium leading-tight">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      if (user.id !== post?.user_id) {
                        alert('작성자가 아닙니다.');
                      } else location.href = `/request-edit/${post?.id}`;
                    }}
                    className="ml-2.5 mx-[4.5px] h-[29px]"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => setIsDModalOpen(true)}
                    className="ml-2.5 mx-[4.5px] h-[29px]"
                  >
                    삭제하기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => alert('신고하기 기능은 아직 준비중입니다.')}
                  className="ml-2.5 mx-[4.5px] h-[29px]"
                >
                  신고하기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <DeleteConfirmModal
        isOpen={isDModalOpen}
        onClose={() => setIsDModalOpen(false)}
        post={post!}
      />
    </>
  );
};

export default BackHeader;

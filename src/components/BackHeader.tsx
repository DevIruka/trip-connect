'use client';
import React, { useState } from 'react';
import BackButton from '../app/post/_components/BackBtn';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import DeleteConfirmModal from '@/app/post/_components/DeleteConfirmModal';
import { Tables } from '@/types/supabase';
import SelectBox from './SelectBox';

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
          user?.id === post?.user_id ? (
            <button onClick={() => setIsModalOpen(true)}>
              <Image
                width={imagesize}
                height={imagesize}
                alt={image}
                src={image}
              />
            </button>
          ) : null
        ) : (
          <Image width={imagesize} height={imagesize} alt={image} src={image} />
        )}

        {isModalOpen && (
          <div
            className="w-full h-screen absolute top-0 right-0"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <SelectBox
              user={user!}
              post={post!}
              setIsDModalOpen={setIsDModalOpen}
            />
          </div>
        )}
      </div>
      <DeleteConfirmModal
        isOpen={isDModalOpen}
        onClose={() => setIsDModalOpen(false)}
        requestpost={post!}
      />
    </>
  );
};

export default BackHeader;

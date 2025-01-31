'use client';
import React, { useState } from 'react';
import BackButton from '../app/post/_components/BackBtn';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { Tables } from '@/types/supabase';
import SelectBox from './SelectBox';
import { Mobile } from './ui/Responsive';

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

  const { user } = useUserStore();
  return (
    <Mobile>
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
            className="w-full h-screen absolute top-0 right-0"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <SelectBox user={user!} requestPost={post!} />
          </div>
        )}
      </div>
    </Mobile>
  );
};

export default BackHeader;

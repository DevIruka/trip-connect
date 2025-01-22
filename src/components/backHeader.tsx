'use client';
import React, { useState } from 'react';
import BackButton from '../app/post/_components/BackBtn';
import Image from 'next/image';
import { fetchPostDelete } from '@/utils/api/supabase_api/home/fetchPostDelete';

const BackHeader = ({
  image,
  imagesize,
  text,
  isThreeDots,
  postid,
}: {
  image: string;
  imagesize: number;
  text: string;
  isThreeDots?: boolean;
  postid?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="h-14 px-5 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white">
      <BackButton />
      <div className="text-center text-black text-lg font-semibold">{text}</div>
      {isThreeDots ? (
        <button onClick={() => setIsModalOpen(true)}>
          <Image width={imagesize} height={imagesize} alt={image} src={image} />
        </button>
      ) : (
        <Image width={imagesize} height={imagesize} alt={image} src={image} />
      )}

      {isModalOpen && (
        <div
          className="w-full h-screen absolute top-0 right-0"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="bg-red-500 grid w-[129px] h-[110px] rounded-lg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)] text-center self-stretch p-2.5 justify-start items-center gap-2.5 text-[#44484c] text-sm font-medium leading-tight">
            <button
              onClick={() => (location.href = `/response-edit/${postid}`)}
            >
              수정하기
            </button>
            <button onClick={() => fetchPostDelete(postid!)}>삭제하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackHeader;

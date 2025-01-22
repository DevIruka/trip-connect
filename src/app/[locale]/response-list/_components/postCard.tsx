'use client';
import Image from 'next/image';
import React from 'react';
import location from '@/data/images/ic-location.svg';
import coin from '@/data/images/coin.svg';
import dot from '@/data/images/Ellipse 14.svg';
import bookmarkButton from '@/data/images/ic-bookmark-empty.svg';
import { Tables } from '@/types/supabase';
import { useRouter } from 'next/navigation';

const PostCard = ({ post }: { post: Tables<'request_posts'> }) => {
  const router = useRouter();
  const handleNavigation = (address: string) => {
    router.push(address);
  };

  return (
    <div>
      <li
        onClick={() => handleNavigation(`post/${post.id}`)}
        className="h-auto pt-3 pb-6 py-4 border-b border-[#f3f3f3] flex-col justify-start items-start gap-3 inline-flex cursor-pointer w-full"
      >
        <div className="h-6 w-full justify-between items-center inline-flex gap-3">
          <div className="flex place-content-between items-center gap-1">
            <div className="h-[22px] px-1.5 bg-[#ffecd4] rounded justify-center items-center inline-flex text-center text-[#ff800a] text-xs font-medium">
              D-24
            </div>
            <div className="tag">
              <Image width={10} height={10} src={location} alt="location" />
              영국
            </div>

            <div className="tag">맛집</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Image
              width={20}
              height={20}
              src={bookmarkButton}
              alt="bookmark button"
            />
          </button>
        </div>
        <div className="grid gap-2">
          <div className="flex gap-1.5 max-w-full">
            <div
              className={`text-base font-semibold leading-snug w-[16px] text-[#0582ff]`}
            >
              Q.
            </div>
            <h1 className="text-black text-base font-semibold leading-snug grow line-clamp-2">
              {post.title}
            </h1>
          </div>
          <div className="pl-[22px] text-[#797c80] text-sm font-medium leading-snug line-clamp-2">
            {post.content}
          </div>
        </div>
        <div className="flex gap-4 items-center text-[#797c80] text-xs font-medium justify-between w-full">
          <div className="flex gap-4">
            <div className="flex gap-1.5 items-center">
              <div className="flex gap-1 items-center">
                <Image width={18} height={18} src={coin} alt="coin" />
                100
              </div>
              <Image width={2} height={2} src={dot} alt="dot" />
              <div>작성자 닉네임</div>
            </div>
          </div>
          <div>1일 전</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigation(`response/${post.id}`);
          }}
          className="w-full h-11 bg-[#eaf4ff] rounded-[10px] justify-center items-center inline-flex text-[#0079f2] text-sm font-semibold"
        >
          답변하기
        </button>
      </li>
    </div>
  );
};

export default PostCard;

'use client';
import Image from 'next/image';
import React from 'react';
import Imoji from '@/data/images/ic-imoji.svg';
import ImojiBlue from '@/data/images/ic-imoji-selected.svg';

import { useUserStore } from '@/store/userStore';
import {
  useLike,
  useLikeCount,
  useLikeMutations,
} from '@/utils/api/tanstack/post/useLike';

const LikeBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const userId = user?.id;
  const { isPostLiked } = useLike(userId);
  const Liked = isPostLiked(postId);
  const { toggleLikeMutation } = useLikeMutations(userId);
  const { likeCount } = useLikeCount(postId);

  return (
    <button
      className={`flex place-items-center text-[#797c80] text-xs font-medium border border-[#dee1e5] py-1.5 pl-2 pr-2.5 rounded-full ${
        Liked && 'border-Blue1'
      }`}
      onClick={() => {
        toggleLikeMutation.mutate({ postId, isLiked: Liked });
      }}
    >
      <Image
        src={Liked ? ImojiBlue : Imoji}
        alt="Imoji"
        height={20}
        width={20}
      />
      <div className={`pl-[3px] pr-[5px] ${Liked && 'text-Blue1'}`}>
        나도 궁금해요
      </div>
      <div className={`font-bold leading-none ${Liked && 'text-Blue1'}`}>
        {likeCount}
      </div>
    </button>
  );
};

export default LikeBtn;

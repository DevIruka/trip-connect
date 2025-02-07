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
import { useTranslation } from 'react-i18next';
import { useModal } from '@/providers/ModalProvider';

const LikeBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const userId = user?.id;
  const { isPostLiked } = useLike(userId);
  const Liked = isPostLiked(postId);
  const { toggleLikeMutation } = useLikeMutations(userId);
  const { likeCount } = useLikeCount(postId);
  const { t } = useTranslation('post');
  const { openModal } = useModal();

  return (
    <button
      className={`flex place-items-center text-xs font-medium border py-1.5 pl-2 pr-2.5 rounded-full ${
        Liked ? 'border-Blue1 text-Blue1' : 'border-[#dee1e5] text-[#797c80]'
      }`}
      onClick={() => {
        if (!user) openModal('loginModal');
        else toggleLikeMutation.mutate({ postId, isLiked: Liked });
      }}
    >
      <Image
        src={Liked ? ImojiBlue : Imoji}
        alt="Imoji"
        height={20}
        width={20}
      />
      <div className="pl-[3px] pr-[5px]">{t('curious')}</div>
      <div className="font-bold leading-none">{likeCount}</div>
    </button>
  );
};

export default LikeBtn;

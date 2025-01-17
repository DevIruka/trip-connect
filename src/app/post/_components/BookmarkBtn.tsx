'use client';

import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import Image from 'next/image';
import React from 'react';
import bookmarkButton from '@/data/images/bookmark.svg';
import { useUserStore } from '@/store/userStore';

const BookmarkBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const userId = user?.id;
  const { isPostBookmarked } = useBookmarks(userId);
  const bookmarked = isPostBookmarked(postId);
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);

  return (
    <>
      {bookmarked ? (
        <button
          onClick={() => {
            deleteBookmarkMutation.mutate(postId);
          }}
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            src={bookmarkButton}
            alt="bookmark button"
            className="brightness-0"
          />
        </button>
      ) : (
        <button
          onClick={() => {
            if (!userId) {
              alert('로그인해주세요');
            }
            addBookmarkMutation.mutate(postId);
          }}
        >
          <Image
            width={20}
            height={20}
            src={bookmarkButton}
            alt="bookmark button"
          />
        </button>
      )}
    </>
  );
};

export default BookmarkBtn;

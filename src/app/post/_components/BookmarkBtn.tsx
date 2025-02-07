'use client';

import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import Image from 'next/image';
import React from 'react';
import bookmarkButton from '@/data/images/ic-bookmark-empty.svg';
import selectedBookmarkBtn from '@/data/images/ic-bookmark.svg';
import { useUserStore } from '@/store/userStore';

const BookmarkBtn = ({ postId }: { postId: string }) => {
  const { user } = useUserStore();
  const userId = user?.id;
  const { isPostBookmarked } = useBookmarks(userId);
  const bookmarked = isPostBookmarked(postId);
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  if (!user) return null;

  return (
    <>
      {bookmarked ? (
        <button
          onClick={() => {
            deleteBookmarkMutation.mutate(postId);
          }}
        >
          <Image
            width={24}
            height={24}
            src={selectedBookmarkBtn}
            alt="bookmark button"
          />
        </button>
      ) : (
        <button
          onClick={() => {
            addBookmarkMutation.mutate(postId);
          }}
        >
          <Image
            width={24}
            height={24}
            src={bookmarkButton}
            alt="bookmark button"
          />
        </button>
      )}
    </>
  );
};

export default BookmarkBtn;

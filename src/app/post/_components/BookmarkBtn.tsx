'use client';

import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import Image from 'next/image';
import React from 'react';
import bookmarkButton from '../../../../public/images/bookmark.svg';

const BookmarkBtn = ({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) => {
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

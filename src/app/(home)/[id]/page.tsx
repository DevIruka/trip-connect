'use client';

import Image from 'next/image';
import Navbar from '../_components/navBar';
import QnaHeader from '../_components/qnaHeader';
import { useBookmarkMutations } from '../_hooks/BookmarkHooks';
import { useBookmarks } from '../_hooks/useBookmark';
import { usePosts } from '../_hooks/usePosts';
import bookmarkButton from '../../../../public/images/bookmark.svg';

const CategoryPage = ({ params }: { params: { id: string } }) => {
  const category = params.id;
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7';
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(category);
  const { isPostBookmarked } = useBookmarks(userId);

  return (
    <>
      <div className="inner h-[2000px]">
        <QnaHeader />
        <Navbar />
        <ul className="">
          {allPosts?.map((post) => {
            const bookmarked = isPostBookmarked(post.id);
            return (
              <li
                onClick={() => {
                  location.href = `/post/${post.id}`;
                }}
                key={post.id}
                className="border-2 rounded-lg p-2 grid cursor-pointer w-full mb-2"
              >
                <div>질문글</div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div>{post.country_city}</div>
                    <div className="flex gap-2 overflow-hidden">
                      {post.category
                        ? post.category.map((category, index) => (
                            <div key={index}>{category}</div>
                          ))
                        : ''}
                    </div>
                  </div>
                  {bookmarked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBookmarkMutation.mutate(post.id);
                      }}
                    >
                      <Image
                        width={20}
                        height={20}
                        src={bookmarkButton}
                        alt="bookmark button"
                        className="brightness-0"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addBookmarkMutation.mutate(post.id);
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
                </div>
                <div>
                  <h1 className="text-xl font-bold">{post.title}</h1>
                  <div>{post.content}</div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 더보기 버튼 */}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="border-2 rounded-lg p-2 grid cursor-pointer w-full mb-2"
          >
            {isFetchingNextPage ? '로딩 중...' : '더보기'}
          </button>
        )}
      </div>
    </>
  );
};

export default CategoryPage;

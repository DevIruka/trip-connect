'use client';

import Image from 'next/image';
import Navbar from '../_components/navBar';
import QnaHeader from '../_components/qnaHeader';
import { useBookmarkMutations } from '../../../utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '../../../utils/api/tanstack/home/useBookmark';
import bookmarkButton from '../../../../public/images/bookmark.svg';
import moreButton from '../../../../public/images/more-button.svg';

import { topicMapping } from '@/utils/topics';
import { usePosts } from '@/utils/api/tanstack/home/usePosts';

const CategoryPage = ({ params }: { params: { id: string } }) => {
  const category = params.id;
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7';
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(category);
  const { isPostBookmarked } = useBookmarks(userId);
  const topicArr = Object.entries(topicMapping);

  return (
    <>
      <div className="h-full w-full mx-auto relative overflow-y-scroll">
        <QnaHeader />
        <Navbar />
        <ul className="px-5">
          {allPosts?.map((post) => {
            const bookmarked = isPostBookmarked(post.id);
            return (
              <li
                onClick={() => {
                  location.href = post.request_id
                    ? `/post/${post.request_id}`
                    : `/post/${post.id}`;
                }}
                key={post.id}
                className="border-2 rounded-lg p-2 grid cursor-pointer w-full mb-2"
              >
                <div>{post.request_id ? '답변글' : '질문글'}</div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div className="bg-gray-300 rounded-md px-1 min-w-10 flex justify-center">
                      {post.request_id
                        ? post.verified_country
                        : post.country_city}
                    </div>
                    <div className="flex gap-2 min-w-10 overflow-x-hidden">
                      {post.category
                        ? topicArr
                            .filter(([_, value]) =>
                              post.category.includes(value),
                            )
                            .map(([key, _]) => (
                              <div
                                className="bg-gray-300 rounded-md px-1"
                                key={key}
                              >
                                {key}
                              </div>
                            ))
                        : ''}
                    </div>
                  </div>
                  {!post.request_id ? (
                    bookmarked ? (
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
                          className="brightness-0 z-0"
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
                    )
                  ) : (
                    <Image
                      width={20}
                      height={20}
                      src={moreButton}
                      alt="more button"
                    />
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
        <div className="px-5">
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
      </div>
    </>
  );
};

export default CategoryPage;

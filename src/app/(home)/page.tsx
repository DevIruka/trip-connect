'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import QnaHeader from './_components/qnaHeader';
import Navbar from './_components/navBar';

import bookmarkButton from '@/data/images/bookmark.svg';
import moreButton from '@/data/images/more-button.svg';
import { topicMapping } from '@/utils/topics';
import { usePosts } from '@/utils/api/tanstack/home/usePosts';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import { useUserStore } from '@/store/userStore';
import { nation } from './_types/homeTypes';
import { useSearchStore } from '@/store/useSearchStore';

const CategoryPage = () => {
  //서치파람스의 값으로 카테고리 1차구분
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const changeCategory = (category: string) => {
    router.push(`?category=${category}`); // URL 업데이트
  };

  //카테고리 한글표시
  const topicArr = Object.entries(topicMapping);

  // //로그인한 유저
  const { user } = useUserStore();
  const userId = user?.id;

  //북마크
  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  const { isPostBookmarked } = useBookmarks(userId);

  //모든 게시물 가져오기
  const { allPosts, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(category);

  //filter로 카테고리 2차구분
  const [filterType, setFilterType] = useState('latest');
  const filteredPosts = allPosts?.filter((post) => {
    if (filterType === 'request') return !post.request_id; // 질문글 (request_id가 없는 경우)
    if (filterType === 'response') return !!post.request_id; // 답변글 (request_id가 있는 경우)
    return true; // 최신 (모두 표시)
  });

  //nation filter
  const [nationFilter, setNationFilter] = useState<nation | null>(
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('selectedLocation')!)
      : null,
  );
  const nationfilteredPosts = filteredPosts?.filter((post) => {
    // Request 유형 처리
    if (nationFilter) {
      if (
        !post.request_id &&
        !post.country_city?.includes(nationFilter.country)
      ) {
        return false;
      }

      // Response 유형 처리
      if (
        post.request_id &&
        !post.verified_country?.includes(nationFilter.country)
      ) {
        return false;
      }
    }

    // 유형이 일치하지 않으면 필터링에서 제외
    return true;
  });

  //검색어 초기화
  const setKeyword = useSearchStore((state) => state.setKeyword);
  useEffect(() => {
    setKeyword('');
  }, [setKeyword]);

  return (
    <>
      <div className="h-full w-full mx-auto relative overflow-y-scroll z-[51]">
        <QnaHeader />
        <Navbar
          setFilterType={setFilterType}
          changeCategory={changeCategory}
          setNationFilter={setNationFilter}
          filterType={filterType}
        />
        <ul className="px-5">
          {nationfilteredPosts?.map((post) => {
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
                              post.category?.includes(value),
                            )
                            .map(([key, _]) => (
                              <div
                                className="bg-gray-300 rounded-md px-1"
                                key={key}
                              >
                                {key}
                              </div>
                            ))
                        : topicArr
                            .filter(([_, value]) =>
                              post.request_posts?.category.includes(value),
                            )
                            .map(([key, _]) => (
                              <div
                                className="bg-gray-300 rounded-md px-1"
                                key={key}
                              >
                                {key}
                              </div>
                            ))}
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
                          if (userId) {
                            addBookmarkMutation.mutate(post.id);
                          } else {
                            alert('로그인해주세요');
                          }
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
                  <h1 className="text-xl font-bold truncate whitespace-nowrap overflow-hidden max-w-[250px]">
                    {post.title}
                  </h1>
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
              onClick={() => {
                fetchNextPage();
              }}
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

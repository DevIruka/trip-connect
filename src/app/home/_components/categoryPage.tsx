'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import bookmarkButton from '@/data/images/ic-bookmark-empty.svg';
import selectedBookmarkBtn from '@/data/images/ic-bookmark.svg';
import location from '@/data/images/ic-location.svg';
import coin from '@/data/images/coin.svg';
import dot from '@/data/images/Ellipse 14.svg';
import pencil from '@/data/images/ic-pencil.svg';
import { topicMapping } from '@/utils/topics';
import { usePosts } from '@/utils/api/tanstack/home/usePosts';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';
import { useUserStore } from '@/store/userStore';
import { useSearchStore } from '@/store/useSearchStore';

import { nation } from '../_types/homeTypes';
import QnaHeader from './qnaHeader';
import Navbar from './navBar';
import PostDday from './dDay';
import LoginModal from '@/components/loginModal';

const CategoryPage = () => {
  //서치파람스의 값으로 카테고리 1차구분
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const changeCategory = (category: string) => {
    router.push(`?category=${category}`); // URL 업데이트
  };

  const handleNavigation = (id: string | number) => {
    router.push(`/post/${id}`);
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

  //로그인해주세요 모달
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 관리

  return (
    <>
      <div className="h-full w-full mx-auto relative overflow-y-scroll z-[51] menuscrollbar">
        <QnaHeader />
        <Navbar
          setFilterType={setFilterType}
          changeCategory={changeCategory}
          setNationFilter={setNationFilter}
          filterType={filterType}
        />
        <ul className="px-5 grid gap-2 items-start">
          {nationfilteredPosts?.map((post) => {
            const bookmarked = isPostBookmarked(post.id);
            return (
              <li
                onClick={() =>
                  handleNavigation(post.request_id ? post.request_id : post.id)
                }
                key={post.id}
                className="h-auto pt-3 pb-6 py-4 border-b border-[#f3f3f3] flex-col justify-start items-start gap-3 inline-flex cursor-pointer w-full"
              >
                <div className="h-6 w-full justify-between items-center inline-flex gap-3">
                  <div className="flex place-content-between items-center gap-1">
                    {post.date_end ? (
                      <PostDday postDateEnd={post.date_end} />
                    ) : null}
                    <div className="tag">
                      <Image
                        width={10}
                        height={10}
                        src={location}
                        alt="location"
                      />
                      {post.request_id
                        ? post.verified_country
                        : JSON.parse(post.country_city!).country}
                    </div>
                    {post.category
                      ? topicArr
                          .filter(([_, value]) =>
                            post.category?.includes(value),
                          )
                          .map(([key, _]) => (
                            <div className="tag" key={key}>
                              {key}
                            </div>
                          ))
                      : topicArr
                          .filter(([_, value]) =>
                            post.request_posts?.category.includes(value),
                          )
                          .map(([key, _]) => (
                            <div className="tag" key={key}>
                              {key}
                            </div>
                          ))}
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
                          src={selectedBookmarkBtn}
                          alt="bookmark button"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (userId) {
                            addBookmarkMutation.mutate(post.id);
                          } else {
                            setIsModalOpen(true);
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
                    ''
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex gap-1.5 max-w-full">
                    <div
                      className={`text-base font-semibold leading-snug w-[16px] ${
                        post.request_id ? 'text-[#f94f5b]' : 'text-[#0582ff]'
                      }`}
                    >
                      {post.request_id ? 'A.' : 'Q.'}
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
                        {post.credit}
                      </div>
                      <Image width={2} height={2} src={dot} alt="dot" />
                      <div>
                        {post.request_id ? '작성자 닉네임' : '1명 답변'}
                      </div>
                    </div>
                  </div>
                  <div>1일 전</div>
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
              className="mt-[25px] mb-[25px] h-11 px-3 py-1.5 rounded-[100px] border border-[#dee1e5] justify-center items-center gap-2.5 inline-flex text-center text-[#44484c] text-sm font-semibold w-full"
            >
              {isFetchingNextPage ? '로딩 중...' : '더보기'}
            </button>
          )}
        </div>

        <button
          className="sticky bottom-8 left-[79%] bg-[#0582ff] text-white p-3 rounded-full shadow-lg"
          onClick={() => {
            router.push('/request');
          }}
        >
          <Image width={36} height={36} src={pencil} alt="pencil" />
        </button>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default CategoryPage;

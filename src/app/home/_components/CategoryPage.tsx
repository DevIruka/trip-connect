'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import pencil from '@/data/images/ic-pencil.svg';
import { usePosts } from '@/utils/api/tanstack/home/usePosts';

import { useSearchStore } from '@/store/useSearchStore';

import { nation, Post } from '../_types/homeTypes';

import ListReqPost from '@/components/ListReqPost';
import ListResPost from '@/components/ListResPost';
import QnaHeader from './QnaHeader';
import Navbar from './NavBar';
import { useUserStore } from '@/store/userStore';
import { useModal } from '@/providers/ModalProvider';
import { useReqPosts } from '@/utils/api/tanstack/home/useReqPosts';
import { useResPosts } from '@/utils/api/tanstack/home/useResPosts';

const CategoryPage = () => {
  //서치파람스의 값으로 카테고리 1차구분
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const changeCategory = (category: string) => {
    router.push(`?category=${category}`); // URL 업데이트
  };

  //모든 게시물 가져오기
  const {
    response_posts,
    fetchNextPage: QfetchNextPage,
    hasNextPage: QhasNextPage,
    isFetchingNextPage: QisFetchingNextPage,
  } = useResPosts();
  const {
    request_posts,
    fetchNextPage: AfetchNextPage,
    hasNextPage: AhasNextPage,
    isFetchingNextPage: AisFetchingNextPage,
  } = useReqPosts();

  const [allPosts, setAllPosts] = useState<Post[] | []>([]);
  useEffect(() => {
    if (response_posts) {
      setAllPosts((prevPosts) => {
        return [...prevPosts, ...response_posts];
      });
    }
  }, [response_posts]);
  useEffect(() => {
    if (request_posts) {
      setAllPosts((prevPosts) => {
        return [...prevPosts, ...request_posts];
      });
    }
  }, [request_posts]);

  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const categoryFilteredPosts = sortedPosts?.filter((post) => {
    if (category === 'all') return post;
    if ('category' in post) {
      return post.category?.includes(category);
    } else if ('request_post' in post && post.request_post) {
      return post.request_posts?.category.includes(category);
    }
  });

  //filter로 카테고리 2차구분
  const [filterType, setFilterType] = useState('latest');
  const filteredPosts = categoryFilteredPosts?.filter((post) => {
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
      if (!post.request_id && !post.country_city?.includes(nationFilter.city)) {
        return false;
      }

      // Response 유형 처리
      if (
        post.request_id &&
        !post.verified_country?.includes(nationFilter.city)
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
  const { openModal } = useModal();

  const { user } = useUserStore();
  return (
    <>
      <div className="w-full h-screen mx-auto relative overflow-y-scroll z-[51] menuscrollbar md:pb-[140px]">
        <QnaHeader />
        <Navbar
          setFilterType={setFilterType}
          changeCategory={changeCategory}
          setNationFilter={setNationFilter}
          filterType={filterType}
        />
        <div className="grid max-w-[1200px] mx-auto">
          <ul className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-start md:gap-4 md:justify-center md:px-9">
            {nationfilteredPosts?.map((post) => {
              return !post.request_id ? (
                <ListReqPost key={post.id} post={post} />
              ) : (
                <ListResPost key={post.id} post={post} />
              );
            })}
          </ul>

          {/* 더보기 버튼 */}
          <div className="px-5 flex justify-center">
            {QhasNextPage && (
              <button
                onClick={() => {
                  QfetchNextPage();
                }}
                disabled={QisFetchingNextPage}
                className="gray-btn"
              >
                {QisFetchingNextPage ? '로딩 중...' : '더보기'}
              </button>
            )}
          </div>
        </div>

        <button
          className="fixed bottom-10 right-10 bg-[#0582ff] text-white p-3 rounded-full shadow-lg"
          onClick={() => {
            if (!user) openModal('loginModal');
            else router.push('/request');
          }}
        >
          <Image width={36} height={36} src={pencil} alt="pencil" />
        </button>
      </div>
    </>
  );
};

export default CategoryPage;

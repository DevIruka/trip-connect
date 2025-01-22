'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import pencil from '@/data/images/ic-pencil.svg';
import { usePosts } from '@/utils/api/tanstack/home/usePosts';

import { useSearchStore } from '@/store/useSearchStore';

import { nation } from '../_types/homeTypes';

import LoginModal from '@/components/LoginModal';
import ListReqPost from '@/components/ListReqPost';
import ListResPost from '@/components/ListResPost';
import QnaHeader from './QnaHeader';
import Navbar from './NavBar';
import { useUserStore } from '@/store/userStore';


const CategoryPage = () => {
  //서치파람스의 값으로 카테고리 1차구분
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const changeCategory = (category: string) => {
    router.push(`?category=${category}`); // URL 업데이트
  };

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
  const { user } = useUserStore();
  return (
    <>
      <div className="h-full w-full mx-auto relative overflow-y-scroll z-[51] menuscrollbar">
        <QnaHeader setIsModalOpen={setIsModalOpen} />
        <Navbar
          setFilterType={setFilterType}
          changeCategory={changeCategory}
          setNationFilter={setNationFilter}
          filterType={filterType}
        />
        <ul className="px-5 grid gap-2 items-start">
          {nationfilteredPosts?.map((post) => {
            return !post.request_id ? (
              <ListReqPost
                key={post.id}
                post={post}
                setIsModalOpen={setIsModalOpen}
              />
            ) : (
              <ListResPost key={post.id} post={post} />
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
            if (!user) setIsModalOpen(true);
            else router.push('/request');
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

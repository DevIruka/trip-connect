'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import pencil from '@/data/images/ic-pencil.svg';
import { useSearchStore } from '@/store/useSearchStore';

import QnaHeader from './QnaHeader';
import Navbar from './NavBar';
import { useUserStore } from '@/store/userStore';
import { useModal } from '@/providers/ModalProvider';
import { useFilteredPosts } from '../_hooks/useFilteredPosts';
import LoadMoreButton from './LoadMoreButton';
import PostList from './PostList';

const Home = () => {
  //서치파람스의 값으로 카테고리 1차구분
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const { user } = useUserStore();
  const router = useRouter();
  const changeCategory = (category: string) => {
    router.push(`?category=${category}`); // URL 업데이트
  };

  const {
    nationFilteredPosts,
    filterType,
    setFilterType,
    setNationFilter,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredPosts(category);

  //검색어 초기화
  const setKeyword = useSearchStore((state) => state.setKeyword);
  useEffect(() => {
    setKeyword('');
  }, [setKeyword]);

  //로그인해주세요 모달
  const { openModal } = useModal();

  return (
    <>
      <div className="w-full h-screen mx-auto relative overflow-y-scroll z-[51] menuscrollbar pb-[140px]">
        <QnaHeader />
        <Navbar
          setFilterType={setFilterType}
          changeCategory={changeCategory}
          setNationFilter={setNationFilter}
          filterType={filterType}
        />
        <div className="grid max-w-[1200px] mx-auto">
          <PostList posts={nationFilteredPosts} />

          {/* 더보기 버튼 */}
          <LoadMoreButton
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
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

export default Home;

'use client';
import React, { useState } from 'react';
import BackHeader from '@/components/BackHeader';
import search from '@/data/images/ic-Search.svg';
import updown from '@/data/images/ic-up&down.svg';
import Image from 'next/image';
import { useReqPosts } from '@/utils/api/tanstack/home/useReqPosts';
import ListReqPost from '@/components/ListReqPost';
import LoginModal from '@/components/LoginModal';

const ResponseListPage = () => {
  const {
    ReqPosts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReqPosts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  if (isPending) {
    return <div>loading...</div>;
  }

  return (
    <div className="h-full w-full relative overflow-y-scroll menuscrollbar">
      <BackHeader image={search} text="답변하기" imagesize={24} />
      <div className="px-5">
        <div className="py-4">
          <button className="px-4 py-2 rounded-[100px] border border-[#dee1e5] bg-[#F9F9F9] gap-1 justify-center items-center flex overflow-hidden text-center text-[#797c80] text-sm font-semibold">
            나라/도시
            <Image src={updown} alt={'dropdown arrow'} width={16} height={16} />
          </button>
        </div>
        <ul>
          {ReqPosts?.map((post) => (
            <div key={post!.id}>
              <ListReqPost
                post={post!}
                setIsModalOpen={setIsModalOpen}
                isReqList={true}
              />
            </div>
          ))}
        </ul>
      </div>
      {isModalOpen && (
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
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
    </div>
  );
};

export default ResponseListPage;

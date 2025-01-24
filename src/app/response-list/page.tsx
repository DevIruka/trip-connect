'use client';
import React, { useState } from 'react';
import BackHeader from '@/components/BackHeader';
import search from '@/data/images/ic-Search.svg';
import updown from '@/data/images/ic-up&down.svg';
import Image from 'next/image';
import { useReqPosts } from '@/utils/api/tanstack/home/useReqPosts';
import ListReqPost from '@/components/ListReqPost';
import LoginModal from '@/components/LoginModal';
import { LocationModal } from '@/components/LocationModalNew';
import { nation } from '../home/_types/homeTypes';

const ResponseListPage = () => {
  const {
    ReqPosts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReqPosts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLModalOpen, setIsLModalOpen] = useState(false);

  //nation filter
  const [nationFilter, setNationFilter] = useState<nation | null>(
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('selectedLocation')!)
      : null,
  );
  const nationfilteredPosts = ReqPosts?.filter((post) => {
    if (
      nationFilter &&
      post &&
      !post.country_city?.includes(nationFilter.city)
    ) {
      return false;
    }

    // 유형이 일치하지 않으면 필터링에서 제외
    return true;
  });

  if (isPending) {
    return <div>loading...</div>;
  }
  return (
    <div className="h-full w-full relative overflow-y-scroll menuscrollbar">
      <BackHeader image={search} text="답변하기" imagesize={24} />
      <div className="px-5">
        <div className="py-4">
          <button
            className={`px-4 py-2 rounded-[100px] border border-[#dee1e5] bg-[#F9F9F9] gap-1 justify-center items-center flex overflow-hidden text-center text-sm font-semibold ${
              nationFilter ? 'text-[#0079f2]' : 'text-#797c80'
            }`}
            onClick={() => setIsLModalOpen(true)} // 모달 열기
          >
            {nationFilter
              ? `${nationFilter.country}/${nationFilter.city}`
              : '나라/도시'}
            <Image src={updown} alt={'dropdown arrow'} width={16} height={16} />
          </button>
        </div>
        <ul>
          {nationfilteredPosts?.map((post) => (
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

      <LocationModal
        isOpen={isLModalOpen}
        onClose={() => {
          setIsLModalOpen(false);
        }}
        setCountry={(country: nation | null) => {
          setNationFilter(country);
        }}
        selectedCountry={nationFilter}
      />
    </div>
  );
};

export default ResponseListPage;

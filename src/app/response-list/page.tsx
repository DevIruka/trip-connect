'use client';
import React, { useState } from 'react';
import BackHeader from '@/components/BackHeader';
import search from '@/data/images/ic-Search.svg';
import updown from '@/data/images/ic-up&down.svg';
import Image from 'next/image';
import { useReqPosts } from '@/utils/api/tanstack/home/useReqPosts';
import ListReqPost from '@/components/ListReqPost';
import { LocationModal } from '@/components/LocationModalNew';
import { nation } from '../home/_types/homeTypes';
import { Desktop } from '@/components/ui/Responsive';

const ResponseListPage = () => {
  const {
    request_posts,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReqPosts();

  const [isLModalOpen, setIsLModalOpen] = useState(false);

  //nation filter
  const [nationFilter, setNationFilter] = useState<nation | null>(
    typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('selectedLocation')!)
      : null,
  );
  const nationfilteredPosts = request_posts?.filter((post) => {
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
    <>
      <div className="h-full w-full relative overflow-y-scroll menuscrollbar md:w-[800px]">
        <BackHeader image={search} text="답변하기" imagesize={24} />
        <div className="px-5">
          <Desktop>
            <div className="text-[#44484c] text-[28px] font-bold leading-[44.80px] py-5">
              답변하기
            </div>
          </Desktop>
          <div className="py-4">
            <button
              className={`px-4 py-2 rounded-[100px] border border-[#dee1e5] bg-[#F9F9F9] gap-1 justify-center items-center flex overflow-hidden text-center text-sm font-semibold ${
                nationFilter ? 'text-[#0079f2]' : 'text-Gray2'
              }`}
              onClick={() => setIsLModalOpen(true)} // 모달 열기
            >
              {nationFilter
                ? `${nationFilter.country}/${nationFilter.city}`
                : '나라/도시'}
              <Image
                src={updown}
                alt={'dropdown arrow'}
                width={16}
                height={16}
              />
            </button>
          </div>
          <ul className="grid gap-5">
            {nationfilteredPosts?.map((post) => (
              <div key={post!.id}>
                <ListReqPost post={post!} isReqList={true} />
              </div>
            ))}
          </ul>
        </div>

        <div className="px-5 flex justify-center">
          {hasNextPage && (
            <button
              onClick={() => {
                fetchNextPage();
              }}
              disabled={isFetchingNextPage}
              className="gray-btn"
            >
              {isFetchingNextPage ? '로딩 중...' : '더보기'}
            </button>
          )}
        </div>
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
    </>
  );
};

export default ResponseListPage;

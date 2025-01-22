'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import CategoryTabs from '../_components/CategoryTabs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TimeAgo from '../_components/TimeAgo';

const coinIcon = '/images/coin.svg';
const markerIcon = '/images/ic-location.svg';

type ResponsePost = {
  id: number;
  title: string;
  content_html: string;
  created_at: string;
  user_id: string;
  request_id: string;
};

const PurchasedPage = () => {
  const { user } = useUserStore();
  const [purchasedPosts, setPurchasedPosts] = useState<ResponsePost[]>([]);
  const router = useRouter();

  const extractFirstImageUrl = (html: string): string | null => {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = html.match(imgRegex);
    return match ? match[1] : null;
  };

  const stripHtmlTags = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  useEffect(() => {
    const fetchPurchasedAnswers = async () => {
      if (!user?.id) return;

      const { data: purchasedData } = await supabase
        .from('purchased_users')
        .select('response_id')
        .eq('user_id', user.id);

      if (!purchasedData || purchasedData.length === 0) return;

      const responseIds = purchasedData.map((item) => item.response_id);

      const { data: responsePostsData } = await supabase
        .from('response_posts')
        .select('id, title, content_html, created_at, user_id, request_id')
        .in('id', responseIds);

      setPurchasedPosts(responsePostsData || []);
    };

    fetchPurchasedAnswers();
  }, [user]);

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="purchased" />

      {/* 스크롤 가능한 컨테이너 */}
      <div
        className="overflow-y-auto"
        style={{
          height: 'calc(100vh - 190px)',
          paddingBottom: '24px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* 구매한 답변 글 목록 */}
        {purchasedPosts.length > 0 ? (
          <ul className="space-y-4">
            {purchasedPosts.map((post) => {
              const firstImageUrl = extractFirstImageUrl(post.content_html);
              const plainContent = stripHtmlTags(post.content_html);

              return (
                <li
                  key={post.id}
                  className="flex flex-col items-start gap-3 border-b bg-white w-full p-4 shadow cursor-pointer"
                  onClick={() => router.push(`/post/${post.request_id}`)}
                >
                  {/* 상단 - 위치 및 카테고리 */}
                  <div className="flex items-center gap-[8px]">
                    {/* 위치 */}
                    <div className="flex items-center gap-[4px] bg-[#F5F7FA] text-[#45484D] rounded-md px-[6px] py-[4px] text-[12px]">
                      <Image
                        src={markerIcon}
                        alt="location"
                        width={12}
                        height={12}
                      />
                      {post.user_id ? <span></span> : null}
                    </div>
                    {/* 카테고리 (임의 값 적용) */}
                    <div className="bg-[#F5F7FA] text-[#45484D] rounded-md px-[6px] py-[4px] text-[12px]">
                      카테고리
                    </div>
                  </div>

                  {/* 제목 및 내용 */}
                  <div className="flex items-start gap-[12px]">
                    {/* A. 표시 */}
                    <p className="text-[16px] font-[600] text-[#FA505B] leading-[22.4px]">
                      A.
                    </p>

                    {/* 제목과 내용을 포함한 컨테이너 */}
                    <div className="flex flex-1 justify-between items-start">
                      {/* 텍스트 컨텐츠 */}
                      <div className="flex flex-col flex-1 max-w-[315px]">
                        {/* 제목 */}
                        <div className="mb-[8px]">
                          <p className="text-[16px] font-bold text-black leading-[22.4px] line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                        {/* 내용 */}
                        <div>
                          <p className="text-[14px] text-[#797C80] line-clamp-2">
                            {plainContent}
                          </p>
                        </div>
                      </div>

                      {/* 이미지 */}
                      {firstImageUrl ? (
                        <div
                          className="w-[86px] h-[86px] rounded-[8px] overflow-hidden flex-shrink-0"
                          style={{
                            transform: 'rotate(-0.024deg)',
                          }}
                        >
                          <Image
                            src={firstImageUrl}
                            alt="답변 이미지"
                            width={86}
                            height={86}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-[86px] h-[86px] flex-shrink-0"
                          style={{
                            transform: 'rotate(-0.024deg)',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 하단 - 크레딧, 작성자 정보, 작성 시간 */}
                  <div className="flex items-center justify-between text-[12px] text-[#797C80] w-full mt-4">
                    <div className="flex items-center gap-[6px]">
                      {/* 크레딧 */}
                      <div className="flex items-center gap-[6px]">
                        <Image
                          src={coinIcon}
                          alt="coin"
                          width={14}
                          height={14}
                        />
                        <span>50 C</span>
                      </div>
                      {/* 점 아이콘 */}
                      <div
                        style={{
                          width: '2px',
                          height: '2px',
                          borderRadius: '50%',
                          backgroundColor: '#797C80',
                        }}
                      />
                      {/* 댓글 수 (임의 값) */}
                      <span>댓글 1</span>
                    </div>
                    {/* 작성 시간 */}
                    <TimeAgo createdAt={post.created_at} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500">구매한 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PurchasedPage;

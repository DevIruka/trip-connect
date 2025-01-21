'use client';

import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import TimeAgo from './_components/TimeAgo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const lefticon = '/images/ic-left.svg';
const marker = '/images/ic-location.svg';
const threedot = '/images/threedot.svg';
const arrowbtn = '/images/ic-arrow.svg';

type Review = {
  id: string;
  review: string;
  user_id: string;
  nickname: string | null;
  profile_img: string | null;
  purchased_at: string | null;
  country: string | null;
};

type SupabaseReview = {
  id: string;
  review: string;
  user_id: string;
  users: {
    nickname: string | null;
    profile_img: string | null;
  } | null;
};

const checkUserCommented = async (
  response_id: string,
  user_id: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('response_id', response_id)
    .eq('user_id', user_id);

  if (error) throw new Error(`댓글 확인 실패: ${error.message}`);

  return data.length > 0;
};

const fetchReviews = async (response_id: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      id, review, user_id,
      users (
        nickname,
        profile_img
      )
    `,
    )
    .eq('response_id', response_id);

  if (error) throw new Error(`리뷰 가져오기 실패:${error.message}`);

  const userIds = data.map((r) => r.user_id);

  const { data: purchaseData, error: purchaseError } = await supabase
    .from('purchased_users')
    .select('user_id, created_at')
    .in('user_id', userIds); // user_id 배열로 검색

  if (purchaseError)
    throw new Error(`구매 정보 가져오기 실패: ${purchaseError.message}`);

  const { data: countryData } = await supabase
    .from('users')
    .select('id, country')
    .in('id', userIds);

  // user_id를 key로, country를 value로 하는 객체 생성
  const userCountryMap: Record<string, string> = {};

  countryData?.forEach((user) => {
    userCountryMap[user.id] = user.country;
  });

  // 3️⃣ user_id를 기준으로 purchaseData 매칭
  const purchaseMap = purchaseData.reduce((acc, cur) => {
    acc[cur.user_id] = cur.created_at;
    return acc;
  }, {} as Record<string, string>);

  return (data as unknown as SupabaseReview[]).map((r) => ({
    id: r.id,
    review: r.review,
    user_id: r.user_id,
    nickname: r.users?.nickname || '익명 사용자',
    profile_img: r.users?.profile_img || null,
    purchased_at: purchaseMap[r.user_id] || null,
    country: userCountryMap[r.user_id],
  }));
};

const ReviewPage = () => {
  const { user } = useUserStore();
  const [review, setReview] = useState('');
  const { response_id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);

  const { data: hasCommented = false, isLoading: isCheckingComment } = useQuery(
    {
      queryKey: ['hasCommented', response_id, user?.id],
      queryFn: () => checkUserCommented(response_id as string, user!.id),
      enabled: !!response_id && !!user?.id,
    },
  );

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', response_id],
    queryFn: () => fetchReviews(response_id as string),
    enabled: !!response_id,
  });

  const addReviewMutation = useMutation<void, Error, string, unknown>({
    mutationFn: async (newReview: string) => {
      if (!user) throw new Error('로그인이 필요합니다.');
      const { error } = await supabase.from('reviews').insert([
        {
          response_id,
          review: newReview,
          user_id: user.id,
        },
      ]);
      if (error) throw new Error(`리뷰 작성 실패: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', response_id] });
      queryClient.invalidateQueries({
        queryKey: ['hasCommented', response_id, user?.id].filter(
          Boolean,
        ) as string[],
      });
      setReview('');
    },
  });

  const deleteReviewMutation = useMutation<void, Error, string, unknown>({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      if (error) throw new Error(`리뷰 삭제 실패: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', response_id] });
    },
  });

  const handleSubmit = () => {
    if (!review.trim()) {
      alert('리뷰를 입력해주세요!');
      return;
    }

    if (hasCommented) {
      alert('이미 댓글을 작성하셨습니다.');
      return;
    }

    addReviewMutation.mutate(review);
  };

  const handleDelete = async (reviewId: string) => {
    if (!response_id || !user?.id) {
      console.error('response_id 또는 user.id가 정의되지 않았습니다.');
      return;
    }

    deleteReviewMutation.mutate(reviewId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['reviews', response_id],
        });

        queryClient.invalidateQueries({
          queryKey: ['hasCommented', response_id, user.id],
        });
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="relative flex items-center py-2.5 px-5">
        <button onClick={handleBack} className="absolute left-5 text-xl">
          <Image
            src={lefticon}
            width={24}
            height={24}
            alt="back"
            className="cursor-pointer"
          />
        </button>
        <h1 className="text-lg font-bold mx-auto">리뷰</h1>
      </header>

      <div className="flex-grow overflow-y-auto">
        <div className="px-[20px] pb-[16px] pt-[20px] text-black text-[16px] font-semibold">
          {reviews.length}개의 리뷰
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : reviews.length > 0 ? (
          reviews.map((r, index) => (
            <div key={r.id}>
              <div className="flex flex-col p-[20px]">
                <div className="flex flex-col">
                  <div className="flex items-start gap-[8px] h-[36px] relative">
                    {r.profile_img ? (
                      <img
                        src={r.profile_img}
                        alt="Profile"
                        className="w-[36px] h-[36px] rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[36px] h-[36px] rounded-full bg-gray-300 flex items-center justify-center">
                        {/* 기본 프로필 이미지가 없는 경우 회색 원 */}
                      </div>
                    )}
                    <div className="ml-3 flex-grow">
                      <div className="flex items-center">
                        <div className="text-sm font-medium flex flex-row justify-center items-center">
                          <span className="text-sm font-medium mr-[4px]">
                            {r.nickname}
                          </span>
                          {r.country ? (
                            <div className="flex items-center justify-center h-[20px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md pl-[3px] pr-[4px] px-[6px]">
                              <Image
                                src={marker}
                                width={10}
                                height={10}
                                alt="marker"
                              />
                              <p className="text-[12px]">{r.country}</p>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <TimeAgo createdAt={r.purchased_at} />
                      <p className="text-sm mt-[12px]">{r.review}</p>
                    </div>

                    {r.user_id === user?.id && (
                      <div className="relative flex items-center h-full">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setVisibleDropdown((prev) =>
                                prev === r.id ? null : r.id,
                              )
                            }
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Image
                              src={threedot}
                              width={20}
                              height={20}
                              alt="edit"
                            />
                          </button>

                          {visibleDropdown === r.id && (
                            <div className="absolute bg-white border border-gray-300 rounded shadow-md right-0 z-10 w-32">
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                삭제하기
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {index < reviews.length - 1 && (
                <div className="px-[20px]">
                  <hr className="border-[#f2f2f2]" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            아직 작성된 리뷰가 없어요
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white flex items-center border-t border-[#f2f2f2] px-5 py-3">
        <input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="답변이 마음에 드셨다면 리뷰를 남겨주세요"
          className="flex-grow border border-[#f2f2f2] rounded-lg px-[16px] py-[14px] text-sm outline-none placeholder-[#A9A9A9]"
          style={{
            fontSize: '12px', // placeholder 텍스트 크기
          }}
        />
        <button
          onClick={handleSubmit}
          className="ml-[4px] flex items-center justify-center"
        >
          <Image src={arrowbtn} width={32} height={32} alt="send" />
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;

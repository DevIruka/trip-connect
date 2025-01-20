'use client';

import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import TimeAgo from './_components/TimeAgo';

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

const ReviewPage = () => {
  const { user } = useUserStore();
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const { response_id } = useParams();
  const router = useRouter();

  const fetchReviews = async () => {
    if (!response_id) return;

    setLoading(true);
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

    if (error) {
      console.error('리뷰 가져오기 실패:', error.message);
      return;
    }

    const userIds = data.map((r) => r.user_id);

    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchased_users')
      .select('user_id, created_at')
      .in('user_id', userIds); // user_id 배열로 검색

    if (purchaseError) {
      console.error('구매 정보 가져오기 실패:', purchaseError.message);
      return;
    }

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

    const formattedReviews: Review[] = (
      data as unknown as SupabaseReview[]
    ).map((r) => ({
      id: r.id,
      review: r.review,
      user_id: r.user_id,
      nickname: r.users?.nickname || '익명 사용자',
      profile_img: r.users?.profile_img || null,
      purchased_at: purchaseMap[r.user_id] || null,
      country: userCountryMap[r.user_id],
    }));

    setReviews(formattedReviews);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!review.trim()) {
      alert('리뷰를 입력해주세요!');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('reviews').insert([
      {
        response_id,
        review,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error('리뷰 작성 실패:', error.message);
      alert('리뷰 작성 중 문제가 발생했습니다.');
      return;
    }

    setReview('');
    fetchReviews(); // 리뷰 목록 갱신
  };

  const handleDelete = async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('리뷰 삭제 실패:', error.message);
      alert('리뷰 삭제 중 문제가 발생했습니다.');
      return;
    }

    fetchReviews();
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchReviews();
  }, [response_id]);

  return (
    <div>
      <div className="min-h-screen bg-white px-[20px] py-[10px] flex flex-col">
        {/* 상단 헤더 */}
        <header className="flex justify-between items-center py-4">
          <button onClick={handleBack} className="text-xl">
            <Image
              src={lefticon}
              width={24}
              height={24}
              alt="back"
              className="cursor-pointer"
              onClick={() => {
                router.back();
              }}
            />
          </button>
          <h1 className="text-lg font-bold">리뷰</h1>
          <div></div>
        </header>

        <div className="pt-[20px] pb-[16px] text-black text-[16px] font-semibold">
          {reviews.length}개의 리뷰
        </div>

        <div className="flex-grow overflow-auto">
          {loading ? (
            <div className="text-center text-gray-500">로딩 중...</div>
          ) : reviews.length > 0 ? (
            reviews.map((r, index) => (
              <div key={r.id}>
                <div className="flex flex-col p-4">
                  <div className="flex flex-col">
                    <div className="flex items-start relative">
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
                      <div className="ml-3">
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
                      {/* 내 리뷰에만 표시되는 '...' 버튼 */}
                      {(r.user_id === user?.id) && (
                        <div className="absolute top-0 right-0">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Image
                              src={threedot}
                              width={20}
                              height={20}
                              alt="edit"
                            />
                          </button>
                          <div className="hidden group-hover:block absolute bg-white border rounded shadow-md right-0">
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              삭제하기
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < reviews.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              아직 작성된 리뷰가 없어요
            </div>
          )}
        </div>
        <div className="flex items-center border-t border-gray-300 pt-[12px] pb-[2px]">
          <input
            type="text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="답변이 마음에 드셨다면 리뷰를 남겨주세요"
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none placeholder-gray-500 mr-[4px]"
            style={{
              fontSize: '12px', // placeholder 텍스트 크기
            }}
          />
          <button
            onClick={handleSubmit}
            // className="p-2 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <Image src={arrowbtn} width={32} height={32} alt="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;

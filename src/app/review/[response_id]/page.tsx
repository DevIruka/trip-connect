'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoEllipsisVertical } from 'react-icons/io5';

type Review = {
  id: string;
  review: string;
  user_id: string;
  nickname: string | null;
  profile_img: string | null;
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
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { response_id } = useParams();
  const router = useRouter();

  const fetchReviews = async () => {
    if (!response_id) return;

    setLoading(true);
    const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, review, user_id,
      users:nickname (
        nickname,
        profile_img
      )
    `) 
    .eq('response_id', response_id);

    if (error) {
      console.error('리뷰 가져오기 실패:', error.message);
      return;
    }

    const formattedReviews: Review[] =  (data as unknown as SupabaseReview[]).map((r) => ({
      id: r.id,
      review: r.review,
      user_id: r.user_id,
      nickname: r.users?.nickname || '익명 사용자',
      profile_img: r.users?.profile_img || null,
    }));

    setReviews(formattedReviews);
    setLoading(false);
  };

  const fetchCurrentUser = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      setCurrentUserId(sessionData.session.user.id);
    } else {
      setCurrentUserId(null);
    }
  };

  const handleSubmit = async () => {
    if (!review.trim()) {
      alert('리뷰를 입력해주세요!');
      return;
    }

    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('reviews').insert([
      {
        response_id,
        review,
        user_id: currentUserId,
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
    fetchCurrentUser();
  }, [response_id]);

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      {/* 상단 헤더 */}
      <header className="flex justify-between items-center py-4">
        <button onClick={handleBack} className="text-xl">
          ←
        </button>
        <h1 className="text-lg font-bold">리뷰</h1>
        <div></div>
      </header>

      <div className="py-4 text-gray-700 text-lg">
        {reviews.length}개의 리뷰
      </div>

      <div className="flex-grow overflow-auto">
        {loading ? (
          <div className="text-center text-gray-500">로딩 중...</div>
        ) : reviews.length > 0 ? (
          reviews.map((r, index) => (
            <div key={r.id}>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  {r.profile_img ? (
                    <img
                      src={r.profile_img}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      {/* 기본 프로필 이미지가 없는 경우 회색 원 */}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{r.nickname}</span>
                    </div>
                    <p className="text-sm mt-1">{r.review}</p>
                  </div>
                </div>

                {/* 내 리뷰에만 표시되는 '...' 버튼 */}
                {r.user_id === currentUserId && (
                  <div className="relative group">
                    <button className="text-gray-500 hover:text-gray-700">
                      <IoEllipsisVertical size={20} />
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
              {index < reviews.length - 1 && <hr className="border-gray-200" />}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-gray-500">
            아직 작성된 리뷰가 없어요
          </div>
        )}
      </div>

      <div className="flex items-center border-t border-gray-300 p-3 gap-3">
        <input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="답변이 마음에 드셨다면 리뷰를 남겨주세요"
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none placeholder-gray-500"
          style={{
            fontSize: '12px', // placeholder 텍스트 크기
          }}
        />
        <button
          onClick={handleSubmit}
          className="p-2 rounded-full flex items-center justify-center hover:bg-gray-200"
        >
          <FaPaperPlane size={16} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;

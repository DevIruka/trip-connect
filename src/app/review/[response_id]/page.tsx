'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import ReviewHeader from './_components/ReviewHeader';
import ReviewInput from './_components/ReviewInput';
import ReviewList from './_components/ReviewList';
import {
  canWriteReview,
  checkUserCommented,
  fetchReviews,
} from './_utils/review';
import { supabase } from '@/utils/supabase/supabaseClient';

const ReviewPage = () => {
  const { user } = useUserStore();
  const { response_id } = useParams();
  const responseId = Array.isArray(response_id) ? response_id[0] : response_id;
  const [review, setReview] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchNickname = async () => {
      if (!responseId) return;

      // 1️⃣ response_posts 테이블에서 request_id 가져오기
      const { data: responsePost, error: responseError } = await supabase
        .from('response_posts')
        .select('request_id')
        .eq('id', responseId)
        .single();

      if (responseError || !responsePost?.request_id) {
        console.error('response_posts 조회 실패:', responseError);
        return;
      }

      const requestId = responsePost.request_id;

      // 2️⃣ request_posts 테이블에서 user_id 가져오기
      const { data: requestPost, error: requestError } = await supabase
        .from('request_posts')
        .select('user_id')
        .eq('id', requestId)
        .single();

      if (requestError || !requestPost?.user_id) {
        console.error('request_posts 조회 실패:', requestError);
        return;
      }

      const userId = requestPost.user_id;

      // 3️⃣ users 테이블에서 nickname 가져오기
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nickname')
        .eq('id', userId)
        .single();

      if (userError || !userData?.nickname) {
        console.error('users 조회 실패:', userError);
        setNickname('익명');
        return;
      }

      setNickname(userData.nickname);
    };

    fetchNickname();
  }, [responseId]);

  const { data: canWrite = false } = useQuery({
    queryKey: ['canWriteReview', response_id, user?.id],
    queryFn: () =>
      user ? canWriteReview(response_id as string, user.id) : false,
    enabled: !!response_id && !!user?.id,
  });

  const { data: hasCommented = false } = useQuery({
    queryKey: ['hasCommented', response_id, user?.id],
    queryFn: () => checkUserCommented(response_id as string, user!.id),
    enabled: !!response_id && !!user?.id,
  });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', response_id],
    queryFn: () => fetchReviews(response_id as string),
    enabled: !!response_id,
  });

  const addReviewMutation = useMutation({
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
        queryKey: ['hasCommented', response_id, user?.id],
      });
      setReview('');
    },
  });

  const { data: reviewCount = 0 } = useQuery({
    queryKey: ['reviewCount', response_id],
    queryFn: async () => {
      if (!response_id) return 0;

      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true }) // 총 개수 가져오기
        .eq('response_id', response_id);

      if (error) {
        console.error('리뷰 개수 불러오기 실패:', error);
        return 0;
      }

      return count || 0;
    },
    enabled: !!response_id,
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw new Error(`리뷰 삭제 실패: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', response_id] });
      queryClient.invalidateQueries({
        queryKey: ['hasCommented', response_id, user?.id],
      });
    },
  });

  const handleDelete = (reviewId: string) => {
    deleteReviewMutation.mutate(reviewId);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      <div className="w-full max-w-none mx-auto md:w-[800px] px-4 md:px-0 flex flex-col flex-grow">
        <div className='md:hidden'>

      <ReviewHeader onBack={() => router.back()} />
        </div>

        {nickname && (
          <>
            <h1 className="hidden md:block text-[#44484c] text-[32px] font-bold mt-6 md:py-[10px]">
              ‘{nickname}’님의 답변에 대한 리뷰
            </h1>
            {reviewCount > 0 && (
              <p className="hidden md:block md:text-lg font-semibold pt-[20px] pb-[16px]">
                {reviewCount}개의 리뷰
              </p>
            )}
          </>
        )}

<div className="flex-grow overflow-auto">
<ReviewList
            reviews={reviews}
            isLoading={isLoading}
            userId={user?.id || ''}
            onDelete={handleDelete}
            responseId={responseId}
          />
        </div>

        <ReviewInput
          review={review}
          setReview={setReview}
          onSubmit={() => {
            if (!review.trim()) {
              alert('리뷰를 입력해주세요!');
              return;
            }

            if (hasCommented) {
              alert('이미 댓글을 작성하셨습니다.');
              return;
            }

            addReviewMutation.mutate(review);
          }}
          disabled={!canWrite}
        />
      </div>
    </div>
  );
};

export default ReviewPage;

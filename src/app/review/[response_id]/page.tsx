'use client';

import React, { useState } from 'react';
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
  useReviewNickname,
} from './_utils/review';
import { supabase } from '@/utils/supabase/supabaseClient';

const ReviewPage = () => {
  const { user } = useUserStore();
  const { response_id } = useParams();
  const responseId = Array.isArray(response_id) ? response_id[0] : response_id;
  const [review, setReview] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: nickname } = useReviewNickname(responseId);

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
    queryKey: ['reviews', response_id, 'count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('response_id', response_id);
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
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      <div className="w-full max-w-none mx-auto md:w-[800px] px-4 md:px-0 flex flex-col flex-grow">
        <div className="md:hidden">
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

        <div className="flex-grow h-full min-h-0 overflow-y-auto max-h-[calc(100vh-160px)] pb-[300px]">
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

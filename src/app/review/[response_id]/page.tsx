'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import ReviewHeader from './_components/ReviewHeader';
import ReviewInput from './_components/ReviewInput';
import ReviewList from './_components/ReviewList';
import { checkUserCommented, fetchReviews } from './_utils/review';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useTranslation } from 'react-i18next';

const ReviewPage = () => {
  const { user } = useUserStore();
  const { response_id } = useParams();
  const [review, setReview] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['hasCommented', response_id, user?.id] });
    },
  });

  const handleDelete = (reviewId: string) => {
    deleteReviewMutation.mutate(reviewId);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ReviewHeader onBack={() => router.back()} />

      <div className="flex-grow overflow-y-auto">
        <ReviewList
          reviews={reviews}
          isLoading={isLoading}
          userId={user?.id || ''}
          onDelete={handleDelete} 
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
      />
    </div>
  );
};

export default ReviewPage;

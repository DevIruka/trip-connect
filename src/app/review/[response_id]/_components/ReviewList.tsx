import React from 'react';
import ReviewItem from './ReviewItem';
import { Review } from '../_utils/review';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';

type ReviewListProps = {
  reviews: Review[];
  isLoading: boolean;
  userId: string;
  responseId: string;
  onDelete: (reviewId: string) => void;
};

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading,
  userId,
  responseId,
  onDelete,
}) => {
  const { t } = useTranslation('review');
  const queryClient = useQueryClient();

  if (isLoading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500">
        {t('reviewNone')}
      </div>
    );
  }

  const handleUpdate = async (reviewId: string, updatedReview: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ review: updatedReview })
        .eq('id', reviewId);

      if (error) throw new Error(`리뷰 수정 실패: ${error.message}`);

      queryClient.invalidateQueries({ queryKey: ['reviews', responseId] });
    } catch (error) {
      console.error(error);
      alert('리뷰 수정 중 문제가 발생했습니다.');
    }
  };

  return (
    <div>
      {reviews.map((review, index) => (
        <div key={review.id}>
          <ReviewItem
            review={review}
            isCurrentUser={review.user_id === userId}
            onDelete={onDelete}
            onUpdate={handleUpdate}
          />
          {index < reviews.length - 1 && (
            <div className="px-[20px]">
              <hr className="border-[#f2f2f2]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;

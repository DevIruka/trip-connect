import React from 'react';
import ReviewItem from './ReviewItem';
import { Review } from '../_utils/review';
import { useTranslation } from 'react-i18next';

type ReviewListProps = {
    reviews: Review[];
    isLoading: boolean;
    userId: string;
    onDelete: (reviewId: string) => void;
  };

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading, userId,onDelete }) => {
const {t} = useTranslation('review')

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

  return (
    <div>
      {reviews.map((review, index) => (
        <div key={review.id}>
          <ReviewItem
            review={review}
            isCurrentUser={review.user_id === userId}
            onDelete={onDelete}
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

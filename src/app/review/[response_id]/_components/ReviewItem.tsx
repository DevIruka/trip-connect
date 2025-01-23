import React, { useState } from 'react';
import Image from 'next/image';
import TimeAgo from './TimeAgo';
import { Review } from '../_utils/review';
import { useTranslation } from 'react-i18next';

const threedot = '/images/threedot.svg';

type ReviewItemProps = {
  review: Review;
  isCurrentUser: boolean;
  onDelete: (reviewId: string) => void;
};

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  isCurrentUser,
  onDelete,
}) => {
    const {t} = useTranslation('review')
  const [visibleDropdown, setVisibleDropdown] = useState(false);

  return (
    <div className="flex flex-col p-[20px]">
      <div className="flex items-start gap-[8px] h-[36px] relative">
        {review.profile_img ? (
          <img
            src={review.profile_img}
            alt="Profile"
            className="w-[36px] h-[36px] rounded-full object-cover"
          />
        ) : (
          <div className="w-[36px] h-[36px] rounded-full bg-gray-300 flex items-center justify-center" />
        )}

        <div className="ml-3 flex-grow">
          <div className="flex items-center">
            <span className="text-sm font-medium">{review.nickname}</span>
          </div>
          <TimeAgo createdAt={review.purchased_at} />
          <p className="text-sm mt-[12px]">{review.review}</p>
        </div>

        {isCurrentUser && (
          <div className="relative flex items-center h-full">
            <button
              onClick={() => setVisibleDropdown((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Image src={threedot} width={20} height={20} alt="edit" />
            </button>
            {visibleDropdown && (
              <div className="absolute bg-white border border-gray-300 rounded shadow-md right-0 z-10 w-32">
                <button
                  onClick={() => onDelete(review.id)}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  {t('reviewDelete')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;

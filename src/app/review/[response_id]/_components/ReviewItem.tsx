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
  onUpdate: (reviewId: string, updatedReview: string) => void;
};

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  isCurrentUser,
  onDelete,
  onUpdate,
}) => {
  const { t } = useTranslation('review');
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedReview, setUpdatedReview] = useState(review.review);

  const handleSave = () => {
    if (updatedReview.trim()) {
      onUpdate(review.id, updatedReview);
      setIsEditing(false);
    } else {
      alert(t('reviewEmptyError'));
    }
  };

  return (
    <div className="flex flex-col p-[20px] gap-[12px]">
      <div className="flex items-center gap-[8px]">
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
        </div>

        {isCurrentUser && (
          <div className="relative">
            <button
              onClick={() => setVisibleDropdown((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Image src={threedot} width={20} height={20} alt="edit" />
            </button>
            {visibleDropdown && (
              <div className="absolute bg-white border border-gray-300 rounded shadow-md right-0 z-10 w-32">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setVisibleDropdown(false);
                  }}
                  className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                >
                  {t('reviewEdit')}
                </button>
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

        <div>
          {isEditing ? (
            <div>
              <textarea
                value={updatedReview}
                onChange={(e) => setUpdatedReview(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedReview(review.review);
                  }}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  {t('reviewEditCancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t('reviewEditSave')}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{review.review}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;

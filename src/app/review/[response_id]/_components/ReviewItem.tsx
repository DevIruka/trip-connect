import React, { useEffect, useRef, useState } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (updatedReview.trim()) {
      onUpdate(review.id, updatedReview);
      setIsEditing(false);
    } else {
      alert(t('reviewEmptyError'));
    }
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  }, [isEditing, updatedReview]);



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

        <div className="flex-grow">
          <div className="flex items-center">
            <span className="text-sm font-medium">{review.nickname}</span>
          </div>
          <TimeAgo createdAt={review.purchased_at} />
        </div>

        {isCurrentUser && (
          <div className="relative">
            <button
              onClick={() => setVisibleDropdown((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 flex items-center justify-center"
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
                  className="block px-4 py-2 text-sm font-medium text-[#44484c]"
                >
                  {t('reviewEdit')}
                </button>
                <button
                  onClick={() => onDelete(review.id)}
                  className="block px-4 py-2 text-sm font-medium text-[#44484c]"
                >
                  {t('reviewDelete')}
                </button>
              </div>
            )}
          </div>
        )}
        </div>

        <div>
          {isEditing ? (
            <div>
              <textarea
                 ref={textareaRef}
                 value={updatedReview}
                 onChange={(e) => setUpdatedReview(e.target.value)}
                 className="w-full p-2 border border-[#80BFFF] rounded text-sm focus:outline-none resize-none"
                 rows={2} 
                 />
              <div className="flex gap-[4px] mt-2 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedReview(review.review);
                  }}
                  className="px-[12px] py-[6px] bg-[#f4f6f9] rounded-md text-[#44484c]"
                >
                  {t('reviewEditCancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="px-[12px] py-[6px] text-white bg-[#0582ff] rounded-md"
                >
                  {t('reviewEditSave')}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm pl-[44px] md:text-base md:font-medium">{review.review}</p>
          )}
      </div>
    </div>
  );
};

export default ReviewItem;

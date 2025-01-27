import React from 'react';
import TimeAgo from '@/app/review/[response_id]/_components/TimeAgo';
import { Tables } from '@/types/supabase';

type ReviewItemProps = {
  review: (Tables<'reviews'> & {
    response_posts: Tables<'response_posts'>;
    users: Tables<'users'>;
    purchased_user_created_at: string | null;
  })
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div
      className="relative"
      style={{
        padding: '12px 20px 24px',
      }}
    >
      <div className="flex items-center px-5 py-4">
        <img
          src={review.users.profile_img || '/images/default-profile.svg'}
          alt="프로필 이미지"
          className="w-9 h-9 rounded-full bg-gray-200"
        />
        <div className="ml-2 flex flex-col justify-between h-full">
          {/* 닉네임과 인증 국가 */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold">
              {review.users.nickname}
            </span>
            {review.users.country_verified && (
              <div className="flex items-center bg-[#F5F7FA] rounded-[16px] px-[4px] py-[2px]">
                <img
                  src="/images/ic-location.svg"
                  alt="location"
                  className="w-[10px] h-[10px]"
                />
                <span className="text-[12px] font-medium text-[#45484D] ml-1">
                  {review.users.country}
                </span>
              </div>
            )}
          </div>

          {review.purchased_user_created_at && (
            <span className="text-[12px] text-gray-500 mt-2">
              <TimeAgo createdAt={review.purchased_user_created_at} />
            </span>
          )}
        </div>
      </div>

      <div
        className="absolute inset-0 border-b"
        style={{
          borderColor: '#F4F4F4',
          left: '20px',
          right: '20px',
        }}
      ></div>

      <p
        className="text-[14px] font-medium text-[#797C80] mb-[12px]"
        style={{
          marginLeft: 'calc(16px + 6px)',
          lineHeight: '1.25',
        }}
      >
        {review.review}
      </p>
    </div>
  );
};

export default ReviewItem;

import React from 'react';
import { ReviewPost, UserData } from '../_types/user';
import TimeAgo from '@/app/review/[response_id]/_components/TimeAgo';

type ReviewItemProps = {
  review: ReviewPost;
  userProfile: UserData;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review, userProfile }) => {
  const { review: reviewContent, purchasedAt } = review;

  console.log('PurchasedAt:', purchasedAt);

  return (
    <div
      className="relative"
      style={{
        padding: '12px 20px 24px',
      }}
    >
      <div className="flex items-center px-5 py-4">
        <img
          src={userProfile.profile_img || '/images/default-profile.svg'}
          alt="프로필 이미지"
          className="w-9 h-9 rounded-full bg-gray-200"
        />
        <div className="ml-2 flex flex-col justify-between h-full">
          {/* 닉네임과 인증 국가 */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold">
              {userProfile.nickname}
            </span>
            {userProfile.country_verified && (
              <div className="flex items-center bg-[#F5F7FA] rounded-[16px] px-[4px] py-[2px]">
                <img
                  src="/images/ic-location.svg"
                  alt="location"
                  className="w-[10px] h-[10px]"
                />
                <span className="text-[12px] font-medium text-[#45484D] ml-1">
                  {userProfile.country_verified}
                </span>
              </div>
            )}
          </div>

          {purchasedAt && (
            <span className="text-[12px] text-gray-500 mt-2">
              <TimeAgo createdAt={purchasedAt} />
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
        {reviewContent}
      </p>
    </div>
  );
};

export default ReviewItem;

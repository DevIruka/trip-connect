import React from 'react';

type Props = {
  userData: {
    profile_img: string;
    nickname: string;
    country_verified: string;
    introduction: string;
  };
};

const ProfileSection: React.FC<Props> = ({ userData }) => (
  <>
    <div className="flex items-center px-5 py-4">
      <img
        src={userData.profile_img || '/default-profile.svg'}
        alt="프로필 이미지"
        className="w-9 h-9 rounded-full bg-gray-200"
      />
      <div className="ml-2">
        <div className="flex items-center text-[16px] font-semibold">
          {userData.nickname}
          <span className="text-sm text-gray-500 ml-2">
            {userData.country_verified}
          </span>
        </div>
      </div>
    </div>
    <div className="px-5">
      <p className="text-[14px] font-medium">{userData.introduction}</p>
    </div>
  </>
);

export default ProfileSection;

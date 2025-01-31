import { countryNameMapping } from '@/data/nation';
import { useLang } from '@/store/languageStore';
import Image from 'next/image';
import React from 'react';

const marker = '/images/ic-location.svg';
const verified = '/images/verified badge.svg';

type Props = {
  userData: {
    profile_img: string;
    nickname: string;
    country_verified: null | boolean;
    introduction: string;
    country: string;
  };
};
const ProfileSection: React.FC<Props> = ({ userData }) => {
  const { lang } = useLang();
  console.log(userData);
  return (
    <>
      <div className="flex items-center px-5 py-4">
        <img
          src={userData?.profile_img || '/images/default-profile.svg'}
          alt="프로필 이미지"
          className="w-9 h-9 rounded-full bg-gray-200"
        />
        <div className="ml-2">
          <div className="flex items-center text-[16px] font-semibold md:text-2xl">
            {userData?.nickname}
            <div className='flex flex-row items-center justify-center'>
              {userData?.country_verified ? (
                <>
                  <Image src={verified} width={16} height={16} alt="verified" />
                </>
              ) : (
                <></>
              )}
            </div>
            {userData?.country ? (
              <div className="flex items-center justify-center h-[22.017px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-md py-[4px] px-[6px] ml-[4px]">
                <Image src={marker} width={10} height={10} alt="marker" />
                <p className="text-[12px]">
                  {lang === 'en'
                    ? countryNameMapping[userData?.country || '']
                    : userData?.country}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="px-5">
        <p className="text-[14px] font-medium md:text-lg">
          {userData?.introduction
            ? userData.introduction
            : '자기 소개가 없습니다.'}
        </p>
      </div>
    </>
  );
};

export default ProfileSection;

'use client';

import React from 'react';
import Image from 'next/image';

type UserProfileSectionProps = {
  profileImg: string;
};

const UserProfileSection = ({ profileImg }: UserProfileSectionProps) => {
  return (
    <div
      className="flex items-center justify-between mb-6"
      style={{ position: 'sticky', marginTop: '60px' }} // 헤더 아래 여백
    >
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          {profileImg ? (
            <Image
              src={profileImg}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {/* 기본 이미지 */}
            </div>
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-bold">나의 활동 내역</h2>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;

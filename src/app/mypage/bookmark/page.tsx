'use client';

import React, { useState } from 'react';
import UserProfileSection from '../_components/UserProfileSection';

const BookmarkPage = () => {
  const [profileImg] = useState<string>(''); // 프로필 이미지 (더미 데이터)

  return (
    <div className="px-5 space-y-4">
      {/* 프로필 섹션 */}
      <UserProfileSection profileImg={profileImg} />

      {/* 북마크 글이 없다는 메시지 */}
      <div className="text-center text-gray-500">북마크한 글이 없습니다.</div>
    </div>
  );
};

export default BookmarkPage;

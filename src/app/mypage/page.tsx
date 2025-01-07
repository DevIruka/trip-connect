'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/supabaseClient';
import Link from 'next/link';

const MyPage = () => {
  const [user, setUser] = useState({
    nickname: '',
    profileImg: '',
    credit: '',
    country: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = 'f7b9a432-75f7-4f6b-9fc6-fb429bdb32ac'; // 테스트용 유저 ID

      const { data, error } = await supabase
        .from('users')
        .select('nickname, profile_img, credit,country')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('에러남:', error);
        return;
      }

      setUser({
        nickname: data.nickname || '닉네임 없음',
        profileImg: data.profile_img || '',
        credit: data.credit || '0',
        country: data.country || '국가 정보 없음',
      });
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="px-5">
      <h1 className="text-black font-[Pretendard] text-[20px] font-semibold leading-none mb-7">
        마이페이지
      </h1>

      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between mb-6">
        {/* 프로필 이미지 */}
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            {user.profileImg ? (
              <Image
                src={user.profileImg}
                alt="Profile"
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {/* Null일 경우 기본 프로필 */}
              </div>
            )}
          </div>

          <div className="ml-4">
            <h2 className="text-lg font-bold">{user.nickname}</h2>
            <p className="text-sm text-gray-600">{user.country}</p>
          </div>
        </div>

        {/* 계정 설정 버튼 */}
        <button className="flex justify-center items-center gap-[10px] px-[12px] py-[3px] rounded-full bg-[#E5E5EC] text-sm text-gray-600">
          계정설정
        </button>
      </div>

      {/* 크레딧 섹션 */}
      <div className="flex flex-col items-center mb-7">
        <div className="flex justify-between items-center w-[335px] p-[12px_16px] rounded-[4px] border border-[#E5E5EC] bg-[#FFF]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[20px] h-[20px] bg-[#D9D9D9]"></div>
            <h2 className="text-lg font-bold">크레딧</h2>
          </div>
          <p className="text-lg text-gray-800">{user.credit}c</p>
        </div>
      </div>

      {/* 셀러 인증 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">셀러 인증</h2>
        <button className="flex flex-col items-start gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full">
          인증하러 가기
        </button>
      </div>

      <div className="h-[1px] w-full bg-[#D9D9D9] mb-7"></div>

      {/* 활동 내역 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">활동 내역</h2>
        <div className="space-y-2 mt-2">
          <Link
            href="/mypage/written"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>내가 작성한 게시물</span>
            <span>▶</span>
          </Link>
          
          <button className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full">
            <span>내가 구매한 게시물</span>
            <span>▶</span>
          </button>
          <button className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full">
            <span>북마크한 게시물</span>
            <span>▶</span>
          </button>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#D9D9D9] mb-7"></div>

      {/* 설정 */}
      <div>
        <h2 className="text-lg font-bold mb-4">설정</h2>
        <button className="flex flex-col items-start gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full">
          언어 설정
        </button>
      </div>
    </div>
  );
};

export default MyPage;

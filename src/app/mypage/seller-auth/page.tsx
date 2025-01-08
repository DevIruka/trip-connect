'use client';

import { supabase } from '@/utils/supabase/supabaseClient';
import { useEffect, useState } from 'react';

const SellerPage = () => {
  const [user, setUser] = useState({
    nickname: '',
    profileImg: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = 'f7b9a432-75f7-4f6b-9fc6-fb429bdb32ac'; // 테스트용 유저 ID

      const { data, error } = await supabase
        .from('users')
        .select('nickname, profile_img')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('에러남:', error);
        return;
      }

      setUser({
        nickname: data.nickname || '닉네임 없음',
        profileImg: data.profile_img || '',
      });
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {/* 프로필 섹션 */}
      <div className="flex items-center mb-6 px-5">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          {/* 프로필 이미지 */}
          <div className="flex items-center justify-center h-full text-gray-500">
            {/* Null일 경우 기본 프로필 */}
          </div>
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-bold">{user.nickname}</h2>
        </div>
      </div>

      {/* 자기 소개 섹션 */}
      <div className="mb-6 px-5">
        <h3 className="text-lg font-bold mb-2">자기 소개</h3>
        <textarea
          className="w-full h-[100px] p-3 border border-gray-300 rounded-lg resize-none"
          placeholder="지금까지 다녀온 여행 경험을 추가해 주세요"
        />
        <div className="flex">
          <button className="inline-flex h-[32px] px-[12px] py-[6px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-black text-white ml-auto">
            저장
          </button>
        </div>
      </div>

      <div className="h-[12px] w-full bg-[#F2F2F2] mb-7 flex-shrink-0"></div>

      {/* 인증 섹션 */}
      <div className="space-y-4 px-5">
        {/* 국가 인증 */}
        <div className="p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-bold mb-1">국가 인증</h3>
          <p className="text-sm text-gray-600 mb-3">
            현재 거주 중인 국가의 인증서를 제출하여 국가와 관련된 게시물을
            생성할 수 있게 해 보세요.
          </p>
          <button className="flex px-[6px] py-[6px] justify-center items-center gap-[10px] rounded-[4px] bg-[#D9D9D9] text-black">
            국가 인증하기
          </button>
        </div>

        {/* 본인 인증 */}
        <div className="p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-bold mb-1">본인 인증</h3>
          <p className="text-sm text-gray-600 mb-3">
            본인 인증을 완료하여 프로필의 신뢰도를 높이고 나의 정보가 올바르게
            전달되도록 해 보세요.
          </p>
          <button className="flex px-[6px] py-[6px] justify-center items-center gap-[10px] rounded-[4px] bg-[#D9D9D9] text-black">
            본인 인증하기
          </button>
        </div>

        {/* 계좌 인증 */}
        <div className="p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-bold mb-1">계좌 인증</h3>
          <p className="text-sm text-gray-600 mb-3">
            계좌 인증을 마치고 프로젝트의 신뢰도를 높이고 내가 받을 정산이
            정확히 전달되도록 해 보세요.
          </p>
          <button className="flex px-[6px] py-[6px] justify-center items-center gap-[10px] rounded-[4px] bg-[#D9D9D9] text-black">
            계좌 인증하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;

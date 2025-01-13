'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/supabaseClient';
import Link from 'next/link';

const MyPage = () => {
  const [user, setUser] = useState({
    nickname: '',
    introduction: '',
    profileImg: '',
    credit: '',
    country: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const userId = userData.user.id;

      const { data: profileData } = await supabase
        .from('users')
        .select('nickname, introduction, profile_img, credit, country')
        .eq('id', userId)
        .single();

      if (!profileData) return;

      setUser({
        nickname: profileData.nickname || '닉네임 없음',
        introduction: profileData.introduction || '아직 자기소개가 없습니다.',
        profileImg: profileData.profile_img || '',
        credit: profileData.credit || '0',
        country: profileData.country || '국가 정보 없음',
      });

      setNicknameInput(profileData.nickname || '');
      setBioInput(profileData.introduction || '');
      setPreviewImage(profileData.profile_img || '');
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const userId = userData.user.id;
    let profileImageUrl = user.profileImg;

    if (selectedImage) {
      const { data: uploadData } = await supabase.storage
        .from('profile-images')
        .upload(`public/${userId}/${selectedImage.name}`, selectedImage, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadData) {
        const publicUrlData = supabase.storage
          .from('profile-images')
          .getPublicUrl(uploadData.path);
        profileImageUrl = publicUrlData.data.publicUrl;
      }
    }

    await supabase
      .from('users')
      .update({
        nickname: nicknameInput,
        introduction: bioInput,
        profile_img: profileImageUrl,
      })
      .eq('id', userId);

    setUser((prev) => ({
      ...prev,
      nickname: nicknameInput,
      introduction: bioInput,
      profileImg: profileImageUrl,
    }));

    setIsModalOpen(false);
  };

  return (
    <div className="px-5">
      <h1 className="text-black font-[Pretendard] text-[20px] font-semibold leading-none mb-7">
        마이페이지
      </h1>

      {/* 프로필 섹션 */}
      <div className="flex items-center justify-between mb-6">
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
              <div className="flex items-center justify-center h-full text-gray-500"></div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold">{user.nickname}</h2>
            <p className="text-sm text-gray-600">{user.country}</p>
          </div>
        </div>
        <button
          className="flex justify-center items-center gap-[10px] px-[12px] py-[3px] rounded-full bg-[#E5E5EC] text-sm text-gray-600"
          onClick={() => setIsModalOpen(true)}
        >
          프로필 설정
        </button>
      </div>

      {/* 자기소개 */}
      <div className="mb-4 text-gray-700">{user.introduction}</div>

      {/* 셀러 인증 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">셀러 인증</h2>
        <Link
          href="/mypage/seller-auth"
          className="flex flex-col items-start gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
        >
          인증하러 가기
        </Link>
      </div>

      <div className="h-[1px] w-full bg-[#D9D9D9] mb-7"></div>

      {/* 활동 내역 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">활동 내역</h2>
        <div className="space-y-2 mt-2">
          <Link
            href="/mypage/request"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>내가 작성한 게시물</span>
            <span>▶</span>
          </Link>
          <Link
            href="/mypage/response"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>내가 답변한 게시물</span>
            <span>▶</span>
          </Link>
          <Link
            href="/mypage/bookmark"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>북마크한 게시물</span>
            <span>▶</span>
          </Link>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#D9D9D9] mb-7"></div>

      {/* 설정 */}
      <Link
        href="/mypage/language"
        className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
      >
        <span>언어 설정</span>
        <span>▶</span>
      </Link>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-[350px] rounded-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-black text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-center text-xl font-bold mb-4">프로필 편집</h2>
            <div className="flex flex-col items-center mb-4">
              {/* 프로필 이미지 */}
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
                <label htmlFor="profileImageInput" className="cursor-pointer">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      이미지 추가
                    </div>
                  )}
                </label>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* 닉네임 */}
              <label className="w-full text-sm font-bold mb-2">닉네임</label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="닉네임 입력"
              />

              {/* 자기소개 */}
              <label className="w-full text-sm font-bold mb-2">자기 소개</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded h-24"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="자기 소개를 입력하세요"
              ></textarea>

              {/* 저장하기 버튼 */}
              <button
                className="w-full p-2 bg-black text-white rounded mt-4"
                onClick={handleSaveProfile}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;

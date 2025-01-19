'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

const MyPage = () => {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut); // signOut 함수 가져오기
  const [userProfile, setUserProfile] = useState({
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
      if (!user?.id) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('nickname, introduction, profile_img, credit, country')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile data:', profileError);
          return;
        }

        setUserProfile({
          nickname: profileData?.nickname || '닉네임 없음',
          introduction:
            profileData?.introduction || '아직 자기소개가 없습니다.',
          profileImg: profileData?.profile_img || '',
          credit: profileData?.credit || '0',
          country: profileData?.country || '국가 정보 없음',
        });

        setNicknameInput(profileData?.nickname || '');
        setBioInput(profileData?.introduction || '');
        setPreviewImage(profileData?.profile_img || '');
      } catch (fetchError) {
        console.error('Unexpected error:', fetchError);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      let profileImageUrl = userProfile.profileImg;

      // 이미지 업로드
      if (selectedImage) {
        const filePath = `${Date.now()}-${selectedImage.name}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, selectedImage, {
            cacheControl: '3600',
            upsert: true, // 동일 이름의 파일 덮어쓰기 허용
          });

        if (uploadError) {
          console.error('Upload Error:', uploadError.message);
          return;
        }

        // 업로드된 파일의 Public URL 가져오기
        const publicUrl = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath).data.publicUrl;

        profileImageUrl = publicUrl;
      }

      // 사용자 프로필 정보 업데이트
      const { error: updateError } = await supabase
        .from('users')
        .update({
          nickname: nicknameInput,
          introduction: bioInput,
          profile_img: profileImageUrl,
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile Update Error:', updateError.message);
        return;
      }

      setUserProfile((prev) => ({
        ...prev,
        nickname: nicknameInput,
        introduction: bioInput,
        profileImg: profileImageUrl,
      }));

      setIsModalOpen(false);
    } catch (saveError) {
      console.error('Unexpected error while saving profile:', saveError);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="px-5 overflow-y-scroll">
      <h1 className="text-black font-[Pretendard] text-[20px] font-semibold leading-none mb-7">
        마이페이지
      </h1>

      {/* 프로필 카드 */}
      <div className="mb-6">
        <div className="flex items-center mb-4 gap-[8px]">
          {/* 프로필 사진 */}
          <div className="w-[52px] h-[52px] rounded-full bg-gray-200 overflow-hidden">
            {userProfile.profileImg ? (
              <Image
                src={userProfile.profileImg}
                alt="Profile"
                width={52}
                height={52}
                className="object-cover"
              />
            ) : (
              <Image
                src="/images/default-profile.svg"
                alt="Default Profile"
                width={52}
                height={52}
                className="object-cover"
              />
            )}
          </div>

          {/* 닉네임, 국가 정보 */}
          <div className="flex-1">
            <h2 className="text-lg font-bold flex items-center">
              {userProfile.nickname}
            </h2>
            <p className="text-sm text-gray-600">{userProfile.country}</p>
          </div>

          {/* 프로필 편집 버튼 */}
          <button
            className="flex justify-center items-center gap-[10px] px-[12px] py-[3px] rounded-full bg-[#E5E5EC] text-sm text-gray-600"
            onClick={() => setIsModalOpen(true)}
          >
            프로필 편집
          </button>
        </div>
      </div>

      {/* 자기소개 */}
      <div className="mb-6">
        <div className="text-gray-700">{userProfile.introduction}</div>
      </div>

      {/* 크레딧 섹션 */}
      <Link
        href="/mypage/credit"
        className="flex items-center justify-between mb-6 p-4 bg-[#F9F9F9] rounded-lg"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center mr-3"></div>
          <span className="text-sm text-gray-700">크레딧</span>
        </div>
        <div className="text-lg font-bold text-gray-800">
          {new Intl.NumberFormat().format(Number(userProfile.credit))} C
        </div>
      </Link>

      {/* 셀러 인증 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">셀러 인증</h2>
        <Link
          href="/mypage/seller-auth"
          className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
        >
          <span>인증하러 가기</span>
          <Image
            src="/images/right arrow.svg"
            alt="Arrow Right"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <div className="h-[1px] w-full bg-[#D9D9D9] mb-7"></div>

      {/* 활동 내역 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">활동 내역</h2>
        <div className="space-y-2 mt-2">
          <Link
            href="/mypage/filters/all"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>내가 작성한 게시물</span>
            <Image
              src="/images/right arrow.svg"
              alt="Arrow Right"
              width={20}
              height={20}
              className="ml-2"
            />
          </Link>
          <Link
            href="/mypage/purchase"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>내가 구매한 게시물</span>
            <Image
              src="/images/right arrow.svg"
              alt="Arrow Right"
              width={20}
              height={20}
              className="ml-2"
            />
          </Link>
          <Link
            href="/mypage/bookmark"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span>북마크한 게시물</span>
            <Image
              src="/images/right arrow.svg"
              alt="Arrow Right"
              width={20}
              height={20}
              className="ml-2"
            />
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
        <Image
          src="/images/right arrow.svg"
          alt="Arrow Right"
          width={20}
          height={20}
          className="ml-2"
        />
      </Link>

      {/* 로그아웃 버튼 */}
      <button
        className="w-full py-3 text-center rounded-[4px] bg-[#E5E5EC] text-black font-medium mt-4"
        onClick={handleLogout}
      >
        로그아웃
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed', // 화면에 고정
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
            zIndex: '50',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '335px',
              padding: '10px 20px',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              borderRadius: '12px',
              background: '#FFF',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '90px', // 텍스트와 버튼 사이 간격
                padding: '8px 0px',
                position: 'relative', // 버튼을 배치하기 위한 기준
                width: '100%', // 부모 디브의 너비를 기준으로 가운데 정렬
                height: '50px', // 원하는 높이 설정
              }}
            >
              {/* 프로필 편집 텍스트 */}
              <h2
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  margin: '0',
                  color: 'var(--Grayscale-Black, #000)', // 텍스트 색상
                  fontFamily: 'Pretendard', // 폰트
                  fontSize: '16px', // 글자 크기
                  fontStyle: 'normal', // 글자 스타일
                  fontWeight: '600', // 글자 굵기
                  lineHeight: '140%', // 줄 높이
                  letterSpacing: '-0.32px', // 글자 간격
                }}
              >
                프로필 편집
              </h2>

              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  right: '0', // 부모 디브 오른쪽에 위치
                  top: '50%',
                  transform: 'translateY(-50%)', // 수직 중앙 정렬
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Image
                  src="/images/ic-Close.svg"
                  alt="닫기"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className="flex flex-col items-center mb-4">
              {/* 프로필 이미지 */}
              <div
                style={{
                  width: '295px', // 부모 직사각형의 가로 크기
                  height: '100px', // 부모 직사각형의 세로 크기
                  display: 'flex',
                  justifyContent: 'center', // 수평 중앙 정렬
                  alignItems: 'center', // 수직 중앙 정렬
                  marginBottom: '16px', // 프로필 이미지와 닉네임 입력 필드 사이 간격
                }}
              >
                <div
                  style={{
                    width: '103px',
                    height: '100px',
                    display: 'flex', // 내부 콘텐츠 정렬을 위한 플렉스 레이아웃
                    justifyContent: 'center', // 수평 중앙 정렬
                    alignItems: 'center', // 수직 중앙 정렬
                    position: 'relative', // 둥근 모양 프로필의 절대 위치를 기준으로 설정
                    overflow: 'hidden', // 부모 박스를 넘어가는 이미지 숨김
                    borderRadius: '50%', // 둥근 모양 설정
                  }}
                >
                  <label htmlFor="profileImageInput" className="cursor-pointer">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/images/default-profile.svg"
                        alt="Default Profile"
                        width={100}
                        height={100}
                        className="object-cover"
                      />
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
              </div>

              {/* 닉네임 */}

              <label
                className="
    w-full text-sm text-black font-pretendard font-semibold leading-[140%] tracking-[-0.28px] mb-2
  "
              >
                닉네임
              </label>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="닉네임 입력"
                className="
    flex flex-col items-start 
    border rounded-[8px] border-gray-300 bg-white w-full
    text-gray-400 text-[14px] font-medium leading-[140%] tracking-[-0.28px]
    overflow-hidden whitespace-nowrap mb-[12px]
  "
                style={{
                  height: '48px', // px 단위로 지정
                  padding: '14px 16px', // px 단위로 지정
                }}
              />

              {/* 자기소개 */}

              <label
                className="
    w-full text-sm font-pretendard font-semibold leading-[140%] tracking-[-0.28px] text-black mb-[8px]
  "
              >
                자기 소개
              </label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="지금까지 다녀온 여행 경험을 추가해 주세요"
                className="
    flex flex-col items-start 
    border rounded-[8px] border-gray-300 bg-white w-full
    text-gray-400 text-[14px] font-normal leading-[142.857%] tracking-[-0.35px]
    overflow-hidden whitespace-nowrap
  "
                style={{
                  height: '140px', // px 단위로 지정
                  padding: '14px 16px', // px 단위로 지정
                }}
              ></textarea>

              <div
                className="flex items-center"
                style={{
                  width: '295px', // 부모 컨테이너 너비
                  padding: '8px 0px', // 상하 여백
                  gap: '8px', // 버튼 간 간격
                }}
              >
                {/* 취소하기 버튼 */}
                <button
                  className="
      flex justify-center items-center
      text-[#45484D] text-[14px] font-pretendard font-semibold tracking-[-0.28px]
      bg-[#DFE1E5] rounded-[12px]
    "
                  style={{
                    width: '72px', // 취소하기 버튼 너비
                    height: '48px', // 버튼 높이
                    padding: '6px 12px', // 내부 여백
                  }}
                  onClick={() => setIsModalOpen(false)} // 모달 창 닫기
                >
                  취소
                </button>

                {/* 저장하기 버튼 */}
                <button
                  className="
      flex justify-center items-center
      text-white text-[14px] font-pretendard font-semibold tracking-[-0.28px]
      bg-[#0582FF] rounded-[12px]
    "
                  style={{
                    width: '215px', // 저장하기 버튼 너비
                    height: '48px', // 버튼 높이
                    padding: '6px 12px', // 내부 여백
                  }}
                  onClick={handleSaveProfile}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;

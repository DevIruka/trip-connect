'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import search from '@/data/images/ic-Search.svg';
import { useRouter } from 'next/navigation';
const lefticon = '/images/ic-left.svg';
const marker = '/images/ic-location.svg';
const coin = '/images/goldcoin.svg';
const badge = '/images/verified badge.svg';


const MyPage = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);
  const [userProfile, setUserProfile] = useState({
    nickname: '',
    introduction: '',
    profileImg: '',
    credit: '',
    country: '',
    authenticated: false, // 인증 상태 추가
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
          .select(
            'nickname, introduction, profile_img, credit, country, authenticated',
          )
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
          authenticated: profileData?.authenticated || false, // 인증 상태 반영
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
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload Error:', uploadError.message);
          return;
        }

        const publicUrl = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath).data.publicUrl;

        profileImageUrl = publicUrl;
      }

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
    <div className="h-full w-full mx-auto relative overflow-y-scroll">
      <div className="px-5">
        <div className="flex flex-row justify-between items-center h-[56px] mb-[16px]">
          <Image
            src={lefticon}
            width={24}
            height={24}
            alt="back"
            className="cursor-pointer"
            onClick={() => {
              router.push('/');
            }}
          />
          <h1 className="text-black text-[20px] font-semibold leading-none">
            마이페이지
          </h1>
          <Link href={'/search'}>
            <Image
              src={search}
              width={24}
              height={24}
              alt="search"
              className="cursor-pointer"
            />
          </Link>
        </div>
        {/* 프로필 카드 */}
        <div className="mb-[16px]">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center">
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
              <div className="flex flex-col ml-[8px]">
                <h2 className="text-[16px] font-[600] mb-[2px] flex items-center">
                  {userProfile.nickname}
                  {/* 인증 뱃지 */}
                  {userProfile.authenticated && (
                    <Image src={badge} width={16} height={16} alt="badge" />
                  )}
                </h2>
                {userProfile.country ? (
                  <div className="flex items-center justify-center h-[20.03px] min-w-6 bg-[#F5F7FA] text-[#45484D] rounded-full py-[3px] pl-[4px] pr-[5px]">
                    <Image src={marker} width={10} height={10} alt="marker" />
                    <p className="text-[12px] font-[500] tracking-[-0.24px]">
                      {userProfile.country}
                    </p>
                  </div>
                ) : (
                  <p className="text-[#45484D] text-[12px]">
                    국가 인증 전이에요!
                  </p>
                )}
              </div>
            </div>
            {/* 프로필 편집 버튼 */}
            <button
              className="flex justify-center items-center gap-[10px] px-[12px] py-[6px] rounded-full bg-[#F5F7FA] text-[12px] text-[#45484D]"
              onClick={() => setIsModalOpen(true)}
            >
              프로필 편집
            </button>
          </div>
        </div>
        {/* 자기소개 */}
        <div className="pb-[16px] border-b border-[#F4F4F4]">
          <div className="text-black font-[500]">
            {userProfile.introduction}
          </div>
        </div>
        {/* 크레딧 섹션 */}
        <Link href="/mypage/credit">
          <div className="border-solid border-[#F4F4F4] shadow-[0px_0px_24px_0px_rgba(0,0,0,0.05)] rounded-lg p-4 flex items-center mt-[20px] mb-[28px]">
            <div className="flex flex-row justify-center items-center">
              <Image src={coin} width={24} height={24} alt="coin" />
              <p className="text-[18px] pt-[1px] ml-[8px] font-[600]">
                {new Intl.NumberFormat().format(Number(userProfile.credit))} C
              </p>
            </div>
          </div>
        </Link>
        {/* 셀러 인증 */}
        <div className="mb-[24px]">
          <h2 className="text-lg font-[700] mb-[12px]">셀러 인증</h2>
          <Link
            href="/mypage/seller-auth"
            className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full"
          >
            <span className="text-[16px] text-[#45484D] font-[500]">
              인증하러 가기
            </span>
            <Image
              src="/images/right arrow.svg"
              alt="Arrow Right"
              width={18}
              height={18}
            />
          </Link>
        </div>
        {/* 활동 내역 */}
        <div className="mb-[24px]">
          <h2 className="text-lg font-[700] mb-[12px]">활동 내역</h2>
          <div className="mt-2">
            <Link
              href="/mypage/filters/all"
              className="flex justify-between items-center gap-[23px] p-[16px] rounded-t-[8px] bg-[#F9F9F9] w-full"
            >
              <span className="text-[16px] text-[#45484D] font-[500]">
                내가 작성한 게시물
              </span>
              <Image
                src="/images/right arrow.svg"
                alt="Arrow Right"
                width={18}
                height={18}
                className="ml-2"
              />
            </Link>
            <div className="flex flex-row justify-center items-center border-b w-[90%] border-[#EBEBEB] mx-auto"></div>
            <Link
              href="/mypage/purchase"
              className="flex justify-between items-center gap-[23px] p-[16px] bg-[#F9F9F9] w-full"
            >
              <span className="text-[16px] text-[#45484D] font-[500]">
                내가 구매한 게시물
              </span>
              <Image
                src="/images/right arrow.svg"
                alt="Arrow Right"
                width={18}
                height={18}
                className="ml-2"
              />
            </Link>
            <div className="flex flex-row justify-center items-center border-b w-[90%] border-[#EBEBEB] mx-auto"></div>
            <Link
              href="/mypage/bookmark"
              className="flex justify-between items-center gap-[23px] p-[16px] rounded-b-[8px] bg-[#F9F9F9] w-full"
            >
              <span className="text-[16px] text-[#45484D] font-[500]">
                북마크한 게시물
              </span>
              <Image
                src="/images/right arrow.svg"
                alt="Arrow Right"
                width={18}
                height={18}
                className="ml-2"
              />
            </Link>
          </div>
        </div>
        {/* 설정 */}
        <h2 className="text-lg font-[700] mb-[12px]">언어 설정</h2>
        <Link
          href="/mypage/language"
          className="flex justify-between items-center gap-[23px] p-[16px] rounded-[8px] bg-[#F9F9F9] w-full mb-[50px]"
        >
          <span className="text-[16px] text-[#45484D] font-[500]">
            언어 설정
          </span>
          <Image
            src="/images/right arrow.svg"
            alt="Arrow Right"
            width={18}
            height={18}
            className="ml-2"
          />
        </Link>
        {/* 모달 */}
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
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
                  gap: '90px',
                  padding: '8px 0px',
                  position: 'relative',
                  width: '100%',
                  height: '50px',
                }}
              >
                {/* 프로필 편집 텍스트 */}
                <h2
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    margin: '0',
                    color: 'var(--Grayscale-Black, #000)',
                    fontFamily: 'Pretendard',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: '140%',
                    letterSpacing: '-0.32px',
                  }}
                >
                  프로필 편집
                </h2>

                {/* 닫기 버튼 */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
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
                    width: '295px',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '103px',
                      height: '100px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '50%',
                    }}
                  >
                    <label
                      htmlFor="profileImageInput"
                      className="cursor-pointer"
                    >
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
                    height: '48px',
                    padding: '14px 16px',
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
                    height: '140px',
                    padding: '14px 16px',
                  }}
                ></textarea>

                <div
                  className="flex items-center"
                  style={{
                    width: '295px',
                    padding: '8px 0px',
                    gap: '8px',
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
                      width: '72px',
                      height: '48px',
                      padding: '6px 12px',
                    }}
                    onClick={() => setIsModalOpen(false)}
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
                      width: '215px',
                      height: '48px',
                      padding: '6px 12px',
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
      {/* 로그아웃 버튼 */}
      <div className="w-full h-[12px] bg-[#f4f6f9]"></div>
      <div className="h-[92px]">
        <button
          className="text-[#44484c] text-sm font-medium ml-[28px] mt-[32px] mb-[43px] cursor-pointer"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default MyPage;

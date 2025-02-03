'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { supabase } from '@/utils/supabase/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import search from '@/data/images/ic-Search.svg';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
const lefticon = '/images/ic-left.svg';
const marker = '/images/ic-location.svg';
const coin = '/images/goldcoin.svg';
const badge = '/images/verified badge.svg';
const close = '/images/ic-Close.svg';

const MyPage = () => {
  const { t } = useTranslation('mypage');
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);
  const [userProfile, setUserProfile] = useState({
    nickname: '',
    introduction: '',
    profileImg: '',
    credit: '',
    country: '',
    authenticated: false,
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
          nickname: profileData?.nickname || t('no_nickname'),
          introduction: profileData?.introduction || t('no_introduction'),
          profileImg: profileData?.profile_img || '',
          credit: profileData?.credit || '0',
          country: profileData?.country || t('unknown_country'),
          authenticated: profileData?.authenticated || false,
        });

        setNicknameInput(profileData?.nickname || '');
        setBioInput(profileData?.introduction || '');
        setPreviewImage(profileData?.profile_img || '');
      } catch (fetchError) {
        console.error('Unexpected error:', fetchError);
      }
    };

    fetchUserProfile();
  }, [user, t]);

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
    <div className="h-full w-full mx-auto relative overflow-y-scroll menuscrollbar container max-w-screen-md lg:max-w-[872px]">
      <div className="px-5 lg:px-[36px]">
        {/* 헤더 */}
        <div className="flex flex-row justify-between items-center h-[56px] mb-[16px] md:justify-start">
          {/* 모바일에서만 뒤로 가기 버튼 표시 */}
          <Image
            src={lefticon}
            width={24}
            height={24}
            alt="back"
            className="cursor-pointer md:hidden"
            onClick={() => {
              router.push('/');
            }}
          />

          <div className="text-black text-[20px] font-semibold leading-none md:ml-0 md:text-[28px] md:w-[800px] md:h-[50px] md:mt-[120px] md:mb-[28px] md:py-[10px]">
            {t('page_title')}
          </div>

          <Link href={'/search'} className="md:hidden">
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
        <div className="mb-[16px] lg:flex lg:items-center lg:justify-between lg:mb-[32px]">
          <div className="flex items-center lg:flex-row md:mt-[45px]">
            {/* 프로필 사진 */}
            <div className="w-[52px] h-[52px] lg:w-[80px] lg:h-[80px] rounded-full bg-gray-200 overflow-hidden">
              {userProfile.profileImg ? (
                <Image
                  src={userProfile.profileImg}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/images/default-profile.svg"
                  alt="Default Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              )}
            </div>

            {/* 닉네임, 국가 정보 및 편집 버튼 */}
            <div className="flex flex-col ml-[8px] lg:ml-[16px] relative">
              <h2
                className="text-[16px] lg:text-[20px] font-semibold mb-[4px] flex items-start"
                style={{
                  minWidth: '120px',
                  maxWidth: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userProfile.nickname}
                {/* 인증 뱃지 */}
                {userProfile.authenticated && (
                  <Image
                    src={badge}
                    width={16}
                    height={16}
                    alt="badge"
                    className="ml-[4px]"
                  />
                )}
              </h2>
              {userProfile.country ? (
                <div className="absolute top-[24px] lg:top-[32px] left-0 flex items-center justify-center h-[20px] min-w-[80px] bg-[#F5F7FA] text-[#45484D] rounded-full py-[3px] px-[4px]">
                  <Image src={marker} width={10} height={10} alt="marker" />
                  <p className="text-[12px] font-medium tracking-[-0.24px] ml-[4px]">
                    {userProfile.country}
                  </p>
                </div>
              ) : (
                <p className="absolute top-[24px] lg:top-[32px]  left-0 text-[#45484D] text-[12px]">
                  {t('not_verified_country')}
                </p>
              )}
            </div>

            {/* 프로필 편집 버튼 */}
            <button
              className="absolute right-12 flex justify-center items-center gap-[10px] px-[12px] py-[6px] lg:px-[16px] lg:py-[8px] rounded-full bg-[#F5F7FA] text-[12px] lg:text-[14px] text-[#45484D]"
              onClick={() => setIsModalOpen(true)}
            >
              {t('edit_profile')}
            </button>
          </div>
        </div>
        {/* 자기소개 */}
        <div className="pb-[16px] lg:pb-[24px] border-b border-[#F4F4F4]">
          <div className="text-black font-[500] text-[14px] lg:text-[16px]">
            {userProfile.introduction}
          </div>
        </div>

        <div className="border-b border-[#F4F4F4] mb-[16px] md:mb-[32px]"></div>

        {/* 크레딧 섹션 */}
        <div
          className="border-solid border-[#F4F4F4] shadow-[0px_0px_24px_0px_rgba(0,0,0,0.05)] 
  rounded-lg p-4 flex items-center mt-[20px] md:mt-[28px] mb-[28px] lg:mb-[40px] 
  px-[24px] md:px-[38px] lg:px-[38px] h-[62px] md:h-[72px]"
        >
          <div className="flex items-center w-full">
            <Image src={coin} width={24} height={24} alt="coin" />
            <p className="text-[18px] lg:text-[20px] pt-[1px] font-[600] ml-[8px]">
              {new Intl.NumberFormat().format(Number(userProfile.credit))} C
            </p>
            <Link href="/mypage/credit" className="ml-auto">
              <p className="text-[#0582ff] text-sm font-medium">
                {t('charge_credits')}
              </p>
            </Link>
          </div>
        </div>
        {/* 셀러 인증 */}
        <div className="md:mt-[28px] mb-[24px] lg:mb-[32px]">
          <h2 className="md:h-[38px] text-lg lg:text-xl font-[700] mb-[12px] md:mb-[16px]">
            {t('seller_verification')}
          </h2>
          <Link
            href="/mypage/seller-auth"
            className="flex justify-between items-center gap-[23px] p-[16px] lg:p-[20px] rounded-[8px] bg-[#F9F9F9] w-full 
  h-[54px] md:h-[72px]"
          >
            <span className="text-[16px] lg:text-[18px] text-[#45484D] font-[500]">
              {t('verify')}
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
        <div className="mb-[24px] lg:mb-[32px]">
          <h2 className="md:h-[38px] text-lg lg:text-xl font-[700] mb-[12px]">
            {t('activity_logs')}
          </h2>
          <div className="mt-[12px] lg:mt-4">
            <Link
              href="/mypage/filters/all"
              className="flex justify-between items-center gap-[23px] p-[16px] lg:p-[20px] rounded-t-[8px] bg-[#F9F9F9] w-full 
      h-[54px] md:h-[72px]"
            >
              <span className="text-[16px] lg:text-[18px] text-[#45484D] font-[500]">
                {t('written_posts')}
              </span>
              <Image
                src="/images/right arrow.svg"
                alt="Arrow Right"
                width={18}
                height={18}
              />
            </Link>
            <div className="flex flex-row justify-center items-center border-b w-[90%] border-[#EBEBEB] mx-auto"></div>
            <Link
              href="/mypage/purchase"
              className="flex justify-between items-center gap-[23px] p-[16px] lg:p-[20px] bg-[#F9F9F9] w-full 
      h-[54px] md:h-[72px]"
            >
              <span className="text-[16px] lg:text-[18px] text-[#45484D] font-[500]">
                {t('purchased_posts')}
              </span>
              <Image
                src="/images/right arrow.svg"
                alt="Arrow Right"
                width={18}
                height={18}
              />
            </Link>
            <div className="flex flex-row justify-center items-center border-b w-[90%] border-[#EBEBEB] mx-auto"></div>
            <Link
              href="/mypage/bookmark"
              className="flex justify-between items-center gap-[23px] p-[16px] lg:p-[20px] rounded-b-[8px] bg-[#F9F9F9] w-full 
      h-[54px] md:h-[72px]"
            >
              <span className="text-[16px] lg:text-[18px] text-[#45484D] font-[500]">
                {t('bookmark_posts')}
              </span>
              <Image
                src="/images/right arrow.svg"
                alt="Arrow Right"
                width={18}
                height={18}
              />
            </Link>
          </div>
        </div>

        {/* 설정 */}
        <h2 className="md:h-[38px] text-lg lg:text-xl font-[700] mb-[12px]">
          {t('language_settings')}
        </h2>
        <Link
          href="/mypage/language"
          className="flex justify-between items-center gap-[23px] p-[16px] lg:p-[20px] rounded-[8px] bg-[#F9F9F9] w-full mb-[50px] 
  h-[54px] md:h-[72px]"
        >
          <span className="text-[16px] lg:text-[18px] text-[#45484D] font-[500]">
            {t('language_settings')}
          </span>
          <Image
            src="/images/right arrow.svg"
            alt="Arrow Right"
            width={18}
            height={18}
          />
        </Link>

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 lg:px-0">
            <div className="bg-white rounded-[12px] flex flex-col items-center gap-[16px] md:gap-[0px] p-[10px_20px] md:w-[686px] md:h-[726px] md:p-[36px]">
              {/* 헤더 */}
              <div className="relative w-full flex items-center md:items-start justify-center md:justify-start h-[50px] md:h-[48px] md:py-[8px] md:mb-[38px]">
                <h2 className="absolute md:static left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 text-black text-[16px] md:text-[20px] font-semibold leading-[140%]">
                  {t('edit_profile')}
                </h2>
                {/* 모바일에서만 X 버튼 표시 */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer md:hidden"
                >
                  <Image src={close} alt="닫기" width={24} height={24} />
                </button>
              </div>

              {/* 프로필 이미지 */}
              <div className="flex justify-center items-center mb-[16px] w-[295px] h-[100px] md:mb-[38px]">
                <div className="relative w-[103px] h-[100px] rounded-full overflow-hidden flex items-center justify-center">
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

              {/* 닉네임 입력 */}
              <div className="w-full">
                <label className="text-black text-sm font-semibold leading-[140%] mb-2 md:mb-[8px]">
                  {t('nickname')}
                </label>
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder={t('nickname_input')}
                  className={`w-full border border-gray-300 bg-white text-[14px] md:mb-[20px] rounded-[8px] px-[14px] py-[16px] md:h-[60px] mb-[12px] 
      ${
        nicknameInput ? 'text-black' : 'text-gray-400'
      } placeholder:text-gray-400 focus:text-black focus:outline-none`}
                />
              </div>

              {/* 자기소개 입력 */}
              <div className="w-full">
                <label className="text-black text-sm font-semibold leading-[140%] mb-[8px]">
                  {t('self_intro')}
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder={t('travel_experience')}
                  className={`w-full border border-gray-300 bg-white md:mb-[38px] text-[14px] rounded-[8px] px-[14px] py-[16px] overflow-y-auto resize-none md:h-[140px] 
      ${
        bioInput ? 'text-black' : 'text-gray-400'
      } focus:text-black focus:outline-none placeholder:text-gray-400`}
                ></textarea>
              </div>

              {/* 버튼 */}
              <div className="flex justify-center gap-[8px] w-full mt-[24px]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex justify-center items-center bg-[#DFE1E5] text-[#45484D] text-[14px] font-semibold rounded-[12px] px-[12px] py-[6px] w-[72px] h-[48px] md:w-[168px] md:h-[64px]"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex justify-center items-center bg-[#0582FF] text-white text-[14px] font-semibold rounded-[12px] px-[12px] py-[6px] w-[215px] h-[48px] md:w-[168px] md:h-[64px]"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 로그아웃 버튼 */}
        <div className="w-full h-[12px] bg-[#f4f6f9]"></div>
        <div className="h-[92px] lg:mt-8 md:mt-17 flex justify-start ml-[28px] mt-[32px] mb-[43px]">
          <button
            className="text-[#44484c] text-sm font-medium cursor-pointer"
            onClick={handleLogout}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

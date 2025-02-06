'use client';

import React from 'react';
import Image from 'next/image';
const close = '/images/ic-Close.svg';

interface EditProfileModalProps {
  onClose: () => void;
  nicknameInput: string;
  setNicknameInput: (value: string) => void;
  bioInput: string;
  setBioInput: (value: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string;
  handleSaveProfile: () => void;
  t: (key: string) => string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  nicknameInput,
  setNicknameInput,
  bioInput,
  setBioInput,
  handleImageUpload,
  previewImage,
  handleSaveProfile,
  t,
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 lg:px-0">
      <div className="bg-white rounded-[12px] flex flex-col items-center gap-[16px] p-[20px] md:w-[686px] md:h-[726px] md:p-[36px]">
        {/* 헤더 */}
        <div className="relative w-full flex items-center justify-center md:justify-start h-[50px] md:h-[48px] md:py-[8px] md:mb-[38px]">
          <h2 className="text-black text-[16px] md:text-[20px] font-semibold leading-[140%]">
            {t('edit_profile')}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-none border-none cursor-pointer md:hidden"
          >
            <Image
              src={close}
              alt="닫기"
              width={24}
              height={24}
              quality={50}
              loading="lazy"
            />
          </button>
        </div>

        {/* 프로필 이미지 */}
        <div className="flex justify-center items-center mb-[16px] w-[295px] h-[100px] md:mb-[38px]">
          <div className="relative w-[103px] h-[100px] rounded-full overflow-hidden flex items-center justify-center">
            <label htmlFor="profileImageInput" className="cursor-pointer">
              <Image
                src={previewImage || '/images/default-profile.svg'}
                alt="Profile Preview"
                width={100}
                height={100}
                quality={70}
                priority
                className="object-cover"
              />
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
            className={`w-full border border-gray-300 bg-white text-[14px] md:mb-[20px] rounded-[8px] px-[14px] py-[16px] md:h-[60px] mb-[12px] ${
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
            className={`w-full border border-gray-300 bg-white md:mb-[38px] text-[14px] rounded-[8px] px-[14px] py-[16px] overflow-y-auto resize-none md:h-[140px] ${
              bioInput ? 'text-black' : 'text-gray-400'
            } focus:text-black focus:outline-none placeholder:text-gray-400`}
          ></textarea>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-[8px] w-full mt-[24px]">
          <button
            onClick={onClose}
            className="flex justify-center items-center bg-[#DFE1E5] text-[#45484D] text-[14px] font-semibold rounded-[12px] w-[72px] h-[48px] md:w-[168px] md:h-[64px]"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSaveProfile}
            className="flex justify-center items-center bg-[#0582FF] text-white text-[14px] font-semibold rounded-[12px] w-[215px] h-[48px] md:w-[168px] md:h-[64px]"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

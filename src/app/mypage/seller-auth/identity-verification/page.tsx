'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/post/_components/BackBtn';
import { useTranslation } from 'react-i18next'; 

const IdentityVerification = () => {
  const { t } = useTranslation('mypage'); 
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleSendCode = () => {
    if (phoneNumber.length === 11 && selectedCountry) {
      router.push('/mypage/seller-auth/identity-verification/codepage');
    } else {
      alert(t('enter_correct_phone')); // 번역 적용
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(input);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  return (
    <div className="h-full w-full px-5 bg-white md:px-[36px] lg:px-[36px] mx-auto max-w-[872px]">
      <div className="h-14 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white md:h-[71px] md:text-[32px]">
        <div className="md:hidden">
          <BackButton />
        </div>
        <h1 className="text-center text-black font-semibold md:text-[32px] text-[18px]">
          {t('identity_verification')} 
        </h1>
        <div className="w-6"></div>
      </div>

      <div>
        <p className="mb-6 text-[#45484D] font-semibold md:text-[20px] text-[18px] leading-[160%] tracking-[-0.36px] md:h-[32px]">
          {t('identity_verification_description')}
        </p>
      </div>

      {/* 국가 선택 */}
      <div className="mb-4">
        <label className="mb-2 block text-[#797C80] text-sm font-medium leading-[140%] tracking-[-0.28px]">
          {t('select_country')}
        </label>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="w-full h-[52px] px-4 py-3 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-black text-sm font-medium leading-[140%] tracking-[-0.28px] whitespace-nowrap md:w-[800px] md:h-[60px] appearance-none"
        >
          <option value="" disabled className="text-gray-400">
            {t('country')} 
          </option>
          <option value="kr">{t('korea')}</option>
          <option value="us">{t('usa')}</option>
          <option value="jp">{t('japan')}</option>
        </select>
      </div>

      <div className="mb-6">
        {/* 전화번호 라벨 */}
        <label className="mb-2 block text-[#797C80] text-sm font-medium leading-[140%] tracking-[-0.28px]">
          {t('phone_number')} 
        </label>
        <input
          type="text"
          placeholder={t('enter_phone_number')}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="w-full h-[52px] border border-gray-300 rounded-lg px-[16px] py-[14px] text-sm md:w-[800px] md:h-[60px]"
          maxLength={11} // 최대 입력 길이 제한
        />
      </div>

      {/* 인증 코드 받기 버튼 */}
        <button
          className={`h-[52px] rounded-xl text-center my-3 text-white text-base font-semibold absolute bottom-0 w-[calc(100%-40px)] md:right-0 md:w-[164px] md:h-[64px] md:mr-4 ${
            phoneNumber.length === 11 && selectedCountry
              ? 'bg-[#0582FF] text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          onClick={handleSendCode}
          disabled={!(phoneNumber.length === 11 && selectedCountry)} 
        >
          <span className="text-[16px] font-pretendard font-semibold leading-normal tracking-[-0.32px] text-white">
            {t('get_verification_code')} {/* 번역 적용 */}
          </span>
        </button>
    </div>
  );
};

export default IdentityVerification;

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/post/_components/BackBtn';
import { useTranslation } from 'react-i18next'; // i18n 추가

const IdentityVerification = () => {
  const { t } = useTranslation('mypage'); // 번역 함수
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(''); // 국가 선택 상태 추가

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
    <div className="h-full w-full px-5 bg-white">
      <div className="h-14 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white">
        <BackButton />
        <h1 className="text-center text-black text-lg font-semibold">
          {t('identity_verification')} {/* 번역 적용 */}
        </h1>
        <div className="w-6"></div>
      </div>

      <div>
        <p
          style={{
            color: 'var(--Grayscale-Gray-1, #45484D)',
            fontFamily: 'Pretendard',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '160%',
            letterSpacing: '-0.36px',
          }}
          className="mb-6"
        >
          {t('identity_verification_description')} {/* 번역 적용 */}
        </p>
      </div>

      {/* 국가 선택 */}
      <div className="mb-4">
        <label
          style={{
            color: 'var(--Grayscale-Gray-2, #797C80)',
            fontFamily: 'Pretendard',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '140%',
            letterSpacing: '-0.28px',
          }}
          className="mb-2 block"
        >
          {t('select_country')} {/* 번역 적용 */}
        </label>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="flex w-[335px] h-[52px] px-[16px] py-[14px] flex-col items-start gap-[10px] self-stretch rounded-lg border border-gray-300 bg-white overflow-hidden text-black text-sm font-medium leading-[140%] tracking-[-0.28px] whitespace-nowrap"
        >
          <option value="" disabled className="text-gray-400">
            {t('country')} {/* 번역 적용 */}
          </option>
          <option value="kr">{t('korea')}</option>
          <option value="us">{t('usa')}</option>
          <option value="jp">{t('japan')}</option>
        </select>
      </div>

      <div className="mb-6">
        {/* 전화번호 라벨 */}
        <label
          className="block mb-2 text-gray-400 text-sm font-medium leading-[140%] tracking-[-0.28px]"
          style={{
            fontFamily: 'Pretendard',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: 500,
          }}
        >
          {t('phone_number')} {/* 번역 적용 */}
        </label>
        <input
          type="text"
          placeholder={t('enter_phone_number')} // 번역 적용
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="w-[335px] h-[52px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
          maxLength={11} // 최대 입력 길이 제한
        />
      </div>

      {/* 인증 코드 받기 버튼 */}
      <button
        className={`h-[52px] rounded-xl text-center my-3 text-white text-base font-semibold absolute bottom-0 w-[335px] ${
          phoneNumber.length === 11 && selectedCountry
            ? 'bg-[#0582FF] text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
        onClick={handleSendCode}
        disabled={!(phoneNumber.length === 11 && selectedCountry)} // 조건에 국가 선택 여부 추가
      >
        <span className="text-[16px] font-pretendard font-semibold leading-normal tracking-[-0.32px] text-white">
          {t('get_verification_code')} {/* 번역 적용 */}
        </span>
      </button>
    </div>
  );
};

export default IdentityVerification;

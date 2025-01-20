'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const lefticon = '/images/ic-left.svg';

const IdentityVerification = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendCode = () => {
    if (phoneNumber.length === 11) {
      router.push('/mypage/seller-auth/identity-verification/codepage');
    } else {
      alert('전화번호를 정확히 입력해주세요.');
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(input);
  };

  return (
    <div className="px-5 py-4 min-h-screen bg-white">
      <div className="flex flex-row justify-between items-center h-[56px] mb-[16px] relative">
        <Image
          src={lefticon}
          width={24}
          height={24}
          alt="back"
          className="cursor-pointer absolute left-0"
          onClick={() => {
            router.back();
          }}
        />
        <h1
          style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Pretendard',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
            letterSpacing: '-0.36px',
          }}
          className="w-full flex justify-center"
        >
          본인 인증
        </h1>
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
          본인 인증을 위해
          <br /> 국가와 전화번호를 입력해 주세요
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
          국가 선택
        </label>
        <select className="flex w-[335px] h-[52px] px-[16px] py-[14px] flex-col items-start gap-[10px] self-stretch rounded-lg border border-gray-300 bg-white overflow-hidden text-black text-sm font-medium leading-[140%] tracking-[-0.28px] whitespace-nowrap">
          <option value="" disabled selected className="text-gray-400">
            국가
          </option>
          <option value="kr">대한민국</option>
          <option value="us">미국</option>
          <option value="jp">일본</option>
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
          전화번호
        </label>
        <input
          type="text"
          placeholder="전화번호를 입력하세요"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="w-[335px] h-[52px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
          maxLength={11} // 최대 입력 길이 제한
        />
      </div>

      {/* 인증 코드 받기 버튼 */}
      <button
        className={`w-full h-[52px] px-[12px] py-[6px] flex justify-center items-center gap-[10px] rounded-[12px] mt-[270px] ${
          phoneNumber.length === 11
            ? 'bg-[#0582FF] text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
        onClick={handleSendCode}
        disabled={phoneNumber.length !== 11}
      >
        <span className="text-[16px] font-pretendard font-semibold leading-normal tracking-[-0.32px] text-white">
          인증 코드 받기
        </span>
      </button>
    </div>
  );
};

export default IdentityVerification;

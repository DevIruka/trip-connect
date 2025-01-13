'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      <button
        className="text-black text-lg font-medium mb-4"
        onClick={() => history.back()}
      >
        ←
      </button>

      <h1 className="text-black text-xl font-bold mb-6">본인 인증</h1>
      <p className="text-gray-600 text-sm mb-6">
        본인 인증을 위해 국가와 전화번호를 입력해 주세요
      </p>

      {/* 국가 선택 */}
      <div className="mb-4">
        <label className="text-gray-600 text-sm mb-2 block">국가 선택</label>
        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="">국가</option>
          <option value="kr">대한민국</option>
          <option value="us">미국</option>
          <option value="jp">일본</option>
          {/* 필요한 국가 추가할 예정 */}
        </select>
      </div>

      {/* 전화번호 입력 */}
      <div className="mb-6">
        <label className="text-gray-600 text-sm mb-2 block">전화번호</label>
        <input
          type="text"
          placeholder="전화번호를 입력하세요"
          value={phoneNumber} 
          onChange={handlePhoneNumberChange} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          maxLength={11} // 최대 입력 길이 제한
        />
      </div>

      {/* 인증 코드 받기 버튼 */}
      <button
        className={`w-full py-3 text-center text-lg font-medium rounded-lg ${
          phoneNumber.length === 11
            ? 'bg-black text-white'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
        onClick={handleSendCode}
        disabled={phoneNumber.length !== 11} 
      >
        인증 코드 받기
      </button>
    </div>
  );
};

export default IdentityVerification;

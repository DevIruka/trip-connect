'use client';

import React from 'react';

const VerificationCodePage = () => {
  return (
    <div className="px-5 py-4 min-h-screen bg-white">
      {/* 뒤로가기 버튼 */}
      <button
        className="text-black text-lg font-medium mb-4"
        onClick={() => history.back()}
      >
        ←
      </button>

      {/* 제목 */}
      <h1 className="text-black text-xl font-bold mb-6">본인 인증</h1>

      {/* 설명 텍스트 */}
      <p className="text-gray-600 text-sm mb-6">인증 코드를 입력해 주세요</p>

      {/* 인증 코드 입력 필드 */}
      <div className="mb-4">
        <label className="text-gray-600 text-sm mb-2 block">인증 코드</label>
        <input
          type="text"
          placeholder="인증 코드를 입력하세요"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* 재전송 버튼 */}
      <button className="text-sm text-black font-medium underline mb-6">
        재전송
      </button>

      {/* 이전 및 제출 버튼 */}
      <div className="flex justify-between">
        <button className="w-[48%] py-3 text-center bg-gray-200 text-black rounded-lg text-lg font-medium">
          이전
        </button>
        <button className="w-[48%] py-3 text-center bg-black text-white rounded-lg text-lg font-medium">
          제출
        </button>
      </div>
    </div>
  );
};

export default VerificationCodePage;

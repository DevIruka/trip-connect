'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const CountryVerification = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen px-5 py-4 bg-white">
      {/* 뒤로가기 버튼 */}
      <button
        className="text-black text-lg font-medium mb-4"
        style={{ position: 'sticky', marginTop: '30px' }}
        onClick={() => router.back()}
      >
        ←
      </button>

      {/* 제목 */}
      <h1 className="text-black text-xl font-semibold mb-6">국가 인증</h1>

      {/* 지도 영역 (현재는 빈 상태) */}
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">지도 표시 영역</span>
      </div>

      {/* 현재 위치 안내 텍스트 */}
      <p className="mt-4 text-sm text-gray-600">
        <strong>현재 위치</strong>로 국가와 지역을 인증해 주세요
      </p>

      {/* 인증 완료 버튼 */}
      <button className="mt-48 w-full py-3 bg-black text-white rounded-lg text-center text-lg font-medium">
        인증 완료하기
      </button>
    </div>
  );
};

export default CountryVerification;

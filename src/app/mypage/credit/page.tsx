'use client';

import React from 'react';

const CreditPage: React.FC = () => {
  return (
    <div className="p-4 bg-white h-screen">
      {/* 상단 제목 및 뒤로가기 */}
      <div className="flex items-center mb-4">
        <button className="text-gray-500">
          ←
        </button>
      </div>

      {/* 보유 크레딧 */}
      <div className="mb-6">
        <h2 className="text-gray-600 text-lg font-medium mb-2">보유 크레딧</h2>
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
          <div className="w-16 h-16 bg-gray-300 rounded" />
          <p className="text-3xl font-bold">3,000c</p>
        </div>
      </div>

      {/* 충전하기 */}
      <h2 className="text-gray-600 text-lg font-medium mb-4">충전하기</h2>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xl font-bold">10,000C</p>
              <p className="text-blue-500 text-sm font-medium mt-1">
                +500 추가크레딧
              </p>
            </div>
            <button className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg">
              10,000원
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditPage;

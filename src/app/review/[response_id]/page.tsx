'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const ReviewPage = () => {
  const [review, setReview] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!review.trim()) {
      alert('리뷰를 입력해주세요!');
      return;
    }
    // 리뷰 제출 로직 (후에 API 호출)
    alert('리뷰가 제출되었습니다!');
    setReview('');
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">
      {/* 상단 헤더 */}
      <header className="flex justify-between items-center py-4">
        <button onClick={handleBack} className="text-xl">
          ←
        </button>
        <h1 className="text-lg font-bold">리뷰</h1>
        <div></div>
      </header>

      <div className="py-4 text-gray-700 text-lg">0개의 리뷰</div>

      <div className="flex-grow flex items-center justify-center text-gray-500">
        아직 작성된 리뷰가 없어요
      </div>

      <div className="flex items-center border-t border-gray-300 p-3 gap-3">
        <input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="답변이 마음에 드셨다면 리뷰를 남겨주세요"
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none placeholder-gray-500"
          style={{
            fontSize: '12px', // placeholder 텍스트 크기
          }}
        />
        <button
          onClick={handleSubmit}
          className="p-2 rounded-full flex items-center justify-center hover:bg-gray-200"
        >
          <FaPaperPlane size={16} className="text-black" />
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;

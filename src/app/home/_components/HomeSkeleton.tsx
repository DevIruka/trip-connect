import React from 'react';

const HomeSkeleton = () => {
  return (
    <>
      <ul className="w-screen max-w-[1200px] grid gap-4 h-screen relative overflow-y-scroll z-[51] menuscrollbar md:pb-[140px]">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <li
              key={index}
              className="p-4 border rounded-md animate-pulse bg-gray-200 mx-4"
            >
              <div className="h-5 w-4/5 bg-gray-300 rounded mb-2"></div>
              {/* 제목 */}
              <div className="h-4 w-3/5 bg-gray-300 rounded mb-2"></div>
              {/* 설명 */}
              <div className="h-48 bg-gray-300 rounded"></div>
              {/* 이미지/내용 영역 */}
            </li>
          ))}
      </ul>
    </>
  );
};

export default HomeSkeleton;

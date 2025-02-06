import React from 'react';

const HomeSkeleton = () => {
  return (
    <div className="grid max-w-[1200px] mx-auto">
      <ul className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-start md:gap-4 md:justify-center md:px-9">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="h-[176px] p-4 border border-[#f3f3f3] flex flex-col gap-3 w-full rounded-xl animate-pulse"
          >
            {/* 상단 정보 (D-day, 태그, 북마크) */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <div className="h-4 w-12 bg-gray-300 rounded-md"></div>{' '}
                {/* D-day */}
                <div className="h-4 w-20 bg-gray-300 rounded-md"></div>{' '}
                {/* 위치 태그 */}
                <div className="h-4 w-16 bg-gray-300 rounded-md"></div>{' '}
                {/* 카테고리 태그 */}
              </div>
              <div className="h-5 w-5 bg-gray-300 rounded-md"></div>{' '}
              {/* 북마크 아이콘 */}
            </div>

            {/* 제목 */}
            <div className="h-5 bg-gray-300 rounded-md w-[90%] max-w-full"></div>

            {/* 내용 */}
            <div className="space-y-1">
              <div className="h-4 bg-gray-300 rounded-md w-full max-w-full"></div>
              <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
            </div>

            {/* 하단 정보 (크레딧, 댓글 수, 날짜) */}
            <div className="flex justify-between items-center w-full">
              <div className="h-4 w-12 bg-gray-300 rounded-md"></div>{' '}
              {/* 크레딧 */}
              <div className="h-4 w-16 bg-gray-300 rounded-md"></div>{' '}
              {/* 날짜 */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeSkeleton;

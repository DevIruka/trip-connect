import React from 'react';

const NavBarSkeleton = () => {
  return (
    <>
      <div className="grid sticky top-[0px] bg-white z-10 max-w-[1200px] mx-auto">
        {/* 탭 메뉴 스켈레톤 */}
        <div className="w-full overflow-auto whitespace-nowrap menuscrollbar px-5 md:px-9">
          <div className="h-auto flex gap-10 pt-5">
            {/* 동적 탭 목록 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[80px] h-[32px] bg-gray-300 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* 필터 버튼 & 드롭다운 스켈레톤 */}
        <div className="flex h-[68px] justify-between px-5 py-4 md:px-9">
          {/* 필터 버튼 */}
          <div className="flex gap-1">
            <div className="w-[50px] h-[32px] bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-[50px] h-[32px] bg-gray-300 rounded-md animate-pulse"></div>
            <div className="w-[50px] h-[32px] bg-gray-300 rounded-md animate-pulse"></div>
          </div>

          {/* 드롭다운 버튼 */}
          <div className="w-[120px] h-[32px] bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default NavBarSkeleton;

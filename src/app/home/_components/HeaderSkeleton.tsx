import React from 'react';

const HeaderSkeleton = () => {
  return (
    <header className="h-[268px] pt-[28px] pb-[40px] bg-Gray9Fill md:h-[238px]">
      <div className="max-w-[1200px] px-[20px] mx-auto md:flex md:justify-between md:px-9 md:pt-10">
        <div className="md:min-w-[364px] pb-[32px]">
          {/* 제목 스켈레톤 */}
          <div className="h-[32px] w-[200px] bg-gray-300 rounded-md md:w-[280px] md:h-[36px] animate-pulse"></div>

          {/* 설명 스켈레톤 */}
          <div className="mt-2 h-[16px] w-[250px] bg-gray-300 rounded-md md:w-[320px] animate-pulse"></div>
          <div className="mt-2 h-[16px] w-[220px] bg-gray-300 rounded-md md:w-[290px] animate-pulse"></div>
        </div>

        {/* 버튼 스켈레톤 */}
        <div className="flex gap-[7px] md:w-full md:justify-end">
          <div className="bg-gray-300 animate-pulse w-[50%] h-[92px] rounded-lg px-[16px] py-[13px] relative md:max-w-[276px] md:h-[112px] md:px-5 md:py-[18px]"></div>
          <div className="bg-gray-300 animate-pulse w-[50%] h-[92px] rounded-lg px-[16px] py-[13px] relative md:max-w-[276px] md:h-[112px] md:px-5 md:py-[18px]"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;

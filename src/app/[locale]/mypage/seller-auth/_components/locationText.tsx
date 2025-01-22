import React from 'react';

type LocationTextProps = {
  locationDescription: string;
  country: string;
};

const LocationText = ({ locationDescription, country }: LocationTextProps) => {
  if (locationDescription) {
    return (
      <div className="mt-7 text-[#44484c] text-base font-semibold leading-snug">
        현재 위치가
        <div className="flex w-full whitespace-nowrap gap-1">
          내 국가로 설정한
          <div className="text-[#0079f2]">
            {country} / {locationDescription}
          </div>
        </div>
        에 있습니다.
      </div>
    );
  } else {
    return (
      <div className="mt-7 text-[#44484c] text-base font-semibold leading-snug">
        <div className="text-[#0079f2]">현재 위치로</div> 국가와 지역을 인증해
        주세요
      </div>
    );
  }
};

export default LocationText;

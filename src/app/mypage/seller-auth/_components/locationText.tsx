import React from 'react';

type LocationTextProps = {
  locationDescription: string;
  country: string;
};

const LocationText = ({ locationDescription, country }: LocationTextProps) => {
  if (locationDescription) {
    return (
      <div className="mt-7 text-[#44484c] text-base font-semibold leading-snug">
        <div className="flex w-full whitespace-nowrap gap-1">
          현재 위치가 내 국가로 설정한
        </div>
        <div className="text-[#0079f2] inline">
          {country} / {locationDescription}
        </div>
        <div className="inline">에 있습니다.</div>
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

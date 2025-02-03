import React from 'react';
import { useTranslation } from 'react-i18next';

type LocationTextProps = {
  locationDescription: string;
  country: string;
};

const LocationText = ({ locationDescription, country }: LocationTextProps) => {
  const { t } = useTranslation('mypage');
  if (locationDescription) {
    return (
      <div>
        <div className="mt-7 text-[#44484c] h-[48px] text-base font-semibold leading-snug md:h-[60px]">
          <div className="flex w-full whitespace-nowrap gap-1">
            현재 위치가 내 국가로 설정한
          </div>
          <div className="text-[#0079f2] inline">
            {country} / {locationDescription}
          </div>
          <div className="inline">에 있습니다.</div>
        </div>

        {/* <div className="mt-7 text-[#44484c] h-[48px] text-base font-semibold leading-snug md:h-[60px]">
          {t('current_location_prefix')}
          <span className="text-[#0079f2]">
            {country} / {locationDescription}
          </span>
          {t('current_location_suffix')}
        </div> */}
      </div>
    );
  } else {
    return (
      <div className="mt-7 text-[#44484c] h-[48px] text-base font-semibold leading-snug md:h-[60px]">
        <div className="text-[#0079f2]">{t('verify_locationA')}</div>{' '}
        {t('verify_locationB')}
      </div>
    );
  }
};

export default LocationText;

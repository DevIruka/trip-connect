import { useLang } from '@/store/languageStore';
import React from 'react';
import { useTranslation } from 'react-i18next';

type LocationTextProps = {
  locationDescription: string;
  country: string;
};

const LocationText = ({ locationDescription, country }: LocationTextProps) => {
    const { lang } = useLang();
  const { t } = useTranslation('mypage');
  if (locationDescription) {
    return (
      <div className="mt-7 text-[#45484D] text-[16px] md:text-[20px] font-pretendard font-semibold leading-[140%] tracking-[-0.4px] h-[48px] md:h-[60px]">
        {lang === 'ko' ? (
          <>
            <div className="flex w-full whitespace-nowrap gap-1">
              현재 위치가 내 국가로 설정한
            </div>
            <div className="inline text-[#0079F2] font-pretendard text-[16px] md:text-[20px] font-semibold leading-[140%] tracking-[-0.4px]">
              {country} / {locationDescription}
            </div>
            <div className="inline">에 있습니다.</div>
          </>
        ) : (
          <>
            Your current location is set to{' '}
            <div className="inline text-[#0079F2] font-pretendard text-[20px] font-semibold leading-[140%] tracking-[-0.4px]">
              {country} / {locationDescription}
            </div>
            .
          </>
        )}
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

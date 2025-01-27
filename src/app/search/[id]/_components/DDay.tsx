import React from 'react';
import { calculateDDay } from '../../_utils/calculateDDay';
import { useLang } from '@/store/languageStore';

const Dday = ({ postDateEnd }: { postDateEnd: string }) => {
  const dDay = calculateDDay(postDateEnd);
  const { lang } = useLang();
  return (
    <>
      {dDay !== '기한 만료' ? (
        <p className="h-[22px] px-1.5 bg-[#ffecd4] rounded justify-center items-center inline-flex text-center text-[#ff800a] text-xs font-medium">
          {dDay}
        </p> // 미래 날짜인 경우
      ) : (
        <p className="h-[22px] px-1.5 bg-[#dee1e5] rounded justify-center items-center inline-flex text-center text-[#44484c] text-xs font-medium">
          {lang == 'en' ? 'Expired' : '기한 만료'}
        </p> // 이미 지난 날짜인 경우
      )}
    </>
  );
};

export default Dday;

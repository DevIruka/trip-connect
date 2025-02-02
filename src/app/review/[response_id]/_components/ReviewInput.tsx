import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const arrowbtn = '/images/ic-arrow.svg';

type Props = {
  review: string;
  setReview: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
};

const ReviewInput: React.FC<Props> = ({
  review,
  setReview,
  onSubmit,
  disabled,
}) => {
  const { t } = useTranslation('review');
  const [isMd, setIsMd] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 800);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#f2f2f2]">
      {isMd ? (
        <div className="flex flex-col items-center w-full border rounded-[8px] border-[#f2f2f2] px-[24px] pt-[24px] pb-[20px]">
          <div className="relative w-full">
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border-transparent rounded-lg px-[16px] py-[14px] text-sm outline-none placeholder-transparent"
            />
            {/* placeholder (텍스트 오버레이) */}
            <div
              className={`absolute top-1/2 left-[16px] -translate-y-1/2 text-[#A9A9A9] text-sm 
              pointer-events-none transition-opacity duration-300 whitespace-pre-line ${
                review ? 'opacity-0' : 'opacity-100'
              } md:text-base`}
            >
              {t('reviewInput')}
              <br />
              {t('paidReviewMessage')}
            </div>
          </div>

          {/* 버튼 (md 이상일 때 input 아래 gap 10px) */}
          <button
            onClick={onSubmit}
            className={`mt-[10px] flex items-center justify-center self-end ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Image src={arrowbtn} width={32} height={32} alt="send" />
          </button>
        </div>
      ) : (
        // md 미만에서는 기존 디자인 유지
        <div className="flex items-center px-5 py-3">
           <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isFocused
              ? `${t('reviewInput')}\n${t('paidReviewMessage')}`
              : t('reviewInput')
            }
            className="flex-grow border border-[#f2f2f2] rounded-lg px-[16px] py-[14px] text-sm outline-none placeholder-[#A9A9A9] resize-none"
            rows={isFocused ? 2 : 1} // 포커스 시 두 줄 표시
          />
          <button
            onClick={onSubmit}
            className={`ml-[4px] flex items-center justify-center ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Image src={arrowbtn} width={32} height={32} alt="send" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewInput;

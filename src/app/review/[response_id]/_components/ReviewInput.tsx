import React from 'react';
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

  return (
    <div className="sticky bottom-0 bg-white flex items-center border-t border-[#f2f2f2] px-5 py-3">
      <input
        type="text"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder={t('reviewInput')}
        className="flex-grow border border-[#f2f2f2] rounded-lg px-[16px] py-[14px] text-sm outline-none placeholder-[#A9A9A9]"
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
  );
};

export default ReviewInput;

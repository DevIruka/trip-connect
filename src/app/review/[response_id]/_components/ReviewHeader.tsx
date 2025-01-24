import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const lefticon = '/images/ic-left.svg';

type Props = {
  onBack: () => void;
};

const ReviewHeader: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation('review');
  return (
    <header className="relative flex items-center py-2.5 px-5">
      <button onClick={onBack} className="absolute left-5 text-xl">
        <Image
          src={lefticon}
          width={24}
          height={24}
          alt="back"
          className="cursor-pointer"
        />
      </button>
      <h1 className="text-lg font-bold mx-auto">{t('reviewLabel')}</h1>
    </header>
  );
};
export default ReviewHeader;

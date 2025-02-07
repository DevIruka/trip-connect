'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  buttonKey: string; // 버튼 이름
  onButtonClick: () => void;
  disabled?: boolean;
};

const HeaderWithButton: React.FC<Props> = ({ buttonKey, onButtonClick }) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
<div className="flex justify-between items-center px-[20px] py-[10px] sticky top-0 z-50 md:py-[16px] md:relative">
<button
        onClick={() => router.back()}
        className="text-lg font-bold text-black"
      >
        ✕
      </button>

      <button
        onClick={onButtonClick}
        className="h-8 px-3 py-1.5 bg-[#0582FF] text-white text-sm font-semibold rounded-[6px]"
      >
        {t(buttonKey)}
      </button>
    </div>
  );
};

export default HeaderWithButton;

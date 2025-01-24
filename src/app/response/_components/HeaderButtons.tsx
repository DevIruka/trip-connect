'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  buttonLabel: string; // 버튼 이름
  onButtonClick: () => void;
  disabled?: boolean;
};

const HeaderWithButton: React.FC<Props> = ({ buttonLabel, onButtonClick }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-[20px] py-[10px] bg-white shadow-md sticky top-0 z-50">
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
        {buttonLabel}
      </button>
    </div>
  );
};

export default HeaderWithButton;

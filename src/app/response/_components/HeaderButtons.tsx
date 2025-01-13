'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BlackButton from '@/components/BlackBtn';

type Props = {
  buttonLabel: string; // 버튼 이름
  onButtonClick: () => void;
  disabled?: boolean;
};

const HeaderWithButton: React.FC<Props> = ({ buttonLabel, onButtonClick }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-5 py-3 bg-white shadow-md border-b">
      <button
        onClick={() => router.back()}
        className="text-lg font-bold text-black"
      >
        ✕
      </button>

      <BlackButton onClick={onButtonClick} className="w-auto px-3 py-1 text-sm">
        {buttonLabel}
      </BlackButton>
    </div>
  );
};

export default HeaderWithButton;

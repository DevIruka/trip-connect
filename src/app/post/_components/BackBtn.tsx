'use client';

import Image from 'next/image';
import backButton from '@/data/images/ic-left.svg';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <button className="h-full" onClick={() => router.back()}>
      <Image width={24} height={24} src={backButton} alt="back button" />
    </button>
  );
};

export default BackButton;

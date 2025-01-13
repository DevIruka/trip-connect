'use client';

import Image from 'next/image';
import backButton from '../../../../public/images/back.svg';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        src={backButton}
        alt="back button"
      />
    </button>
  );
};

export default BackButton;

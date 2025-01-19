'use client';

import Image from 'next/image';
import backButton from '@/data/images/ic-left.svg';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BackButton = () => {
  // const router = useRouter();

  return (
    <button className="h-full">
      <Link href={'/'}>
        <Image width={24} height={24} src={backButton} alt="back button" />
      </Link>
    </button>
  );
};

export default BackButton;

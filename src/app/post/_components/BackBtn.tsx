'use client';

import Image from 'next/image';
import backButton from '../../../../public/images/back.svg';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BackButton = () => {
  // const router = useRouter();

  return (
    <button>
      <Link href={'/'}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
          src={backButton}
          alt="back button"
        />
      </Link>
    </button>
  );
};

export default BackButton;

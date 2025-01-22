import React from 'react';

import Image from 'next/image';
import BackButton from '@/app/[locale]/post/_components/BackBtn';

const BackHeader = ({
  image,
  imagesize,
  text,
}: {
  image: string;
  imagesize: number;
  text: string;
}) => {
  return (
    <div className="h-14 px-5 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white">
      <BackButton />
      <div className="text-center text-black text-lg font-semibold">{text}</div>
      <Image width={imagesize} height={imagesize} alt={image} src={image} />
    </div>
  );
};

export default BackHeader;

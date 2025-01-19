import React from 'react';
import BackButton from '../app/post/_components/BackBtn';
import Image from 'next/image';

const BackHeader = ({ image, text }: { image: string; text: string }) => {
  return (
    <div className="h-14 px-5 py-2.5 place-content-center items-center flex justify-between sticky top-0 z-50 bg-white">
      <BackButton />
      <div className="text-center text-black text-lg font-semibold">{text}</div>
      <Image width={20} height={20} alt={image} src={image} />
    </div>
  );
};

export default BackHeader;

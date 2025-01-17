import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import pencil from '@/data/images/✏️ 연필.svg';
import ball from '@/data/images/💡 전구.svg';

type HeaderButtonProps = {
  url: string;
  text1: string;
  text2: string;
  title: string;
};
const HeaderButton = ({ url, text1, text2, title }: HeaderButtonProps) => {
  return (
    <Link
      href={`/${url}`}
      className="w-[50%] h-[92px] bg-white rounded-lg px-[16px] py-[13px] relative"
    >
      <div className="flex flex-col space-y-[8px]">
        <div className="text-black text-base font-semibold leading-normal">
          {title}
        </div>
        <div className="text-[#797c80] text-xs font-medium">
          {text1}
          <br />
          {text2}
        </div>
      </div>
      <Image
        className="absolute top-[12px] right-[12px]"
        src={url === 'request' ? pencil : ball}
        alt={title}
        width={40}
        height={40}
      />
    </Link>
  );
};

export default HeaderButton;

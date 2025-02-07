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
  handleClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};
const HeaderButton = ({
  url,
  text1,
  text2,
  title,
  handleClick,
}: HeaderButtonProps) => {
  return (
    <>
      <Link
        href={`/${url}`}
        onClick={handleClick}
        className="w-[50%] h-[92px] bg-white rounded-lg px-[16px] py-[13px] relative md:max-w-[276px] md:h-fit md:px-5 md:py-[18px]"
      >
        <div className="flex flex-col space-y-[8px]">
          <div className="text-black text-base font-semibold leading-normal md:text-lg">
            {title}
          </div>
          <div className="text-Gray2 text-xs font-medium md:text-sm">
            {text1}
            <br />
            {text2}
          </div>
        </div>
        <Image
          className="absolute top-[12px] right-[12px] md:top-[18px] md:right-5"
          src={url === 'request' ? pencil : ball}
          alt={title}
          width={40}
          height={40}
        />
      </Link>
    </>
  );
};

export default HeaderButton;

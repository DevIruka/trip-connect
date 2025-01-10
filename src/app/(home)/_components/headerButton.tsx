import Link from 'next/link';
import React from 'react';
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
      className="w-[50%] h-[100px] bg-black text-white rounded-lg p-2 grid items-center"
    >
      <div>
        <div className="text-[10px] pb-2">
          {text1}
          <br />
          {text2}
        </div>
        <div>{title}</div>
      </div>
    </Link>
  );
};

export default HeaderButton;

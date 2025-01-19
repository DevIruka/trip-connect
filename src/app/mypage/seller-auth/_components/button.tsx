import Link from 'next/link';
import React from 'react';

const Button = ({
  isVerified,
  text,
  link,
}: {
  isVerified: boolean;
  text: string;
  link: string;
}) => {
  return (
    <Link href={`/mypage/seller-auth/${link}`}>
      <button className="h-8 px-3 py-1.5 bg-[#0582ff] rounded-md justify-center items-center gap-2.5 inline-flex text-white text-sm font-semibold">
        {isVerified ? '다시' : text} 인증하기
      </button>
    </Link>
  );
};

export default Button;

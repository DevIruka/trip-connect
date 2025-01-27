import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import pencil from '@/data/images/✏️ 연필.svg';
import ball from '@/data/images/💡 전구.svg';
import { useUserStore } from '@/store/userStore';

type HeaderButtonProps = {
  url: string;
  text1: string;
  text2: string;
  title: string;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
const HeaderButton = ({
  url,
  text1,
  text2,
  title,
  setIsModalOpen,
}: HeaderButtonProps) => {
  const { user } = useUserStore();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // `url`이 `request`이고 `user`가 없으면 모달 열기
    if (url === 'request' && !user) {
      e.preventDefault(); // 링크 기본 동작 방지
      setIsModalOpen!(true); // 모달 열기
    }
  };

  return (
    <>
      <Link
        href={`/${url}`}
        onClick={handleClick}
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
    </>
  );
};

export default HeaderButton;

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { IoMdCloseCircle } from 'react-icons/io';

const SearchPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const { isSearching, setIsSearching } = useState<boolean>(true);

  return !isSearching ? (
    <div className="inner">
      <form className="flex flex-row items-center gap-2">
        <Link href="/">
          <IoIosArrowBack size={30} />
        </Link>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="border border-black rounded-full h-8 w-72 mt-1 mb-1 px-4"
        />
          <button type="button" className="absolute right-12 top-2">
            <IoMdCloseCircle size={25}/>
          </button>
        <Link href="/">
          <span className="mr-1">닫기</span>
        </Link>
      </form>
      <div className="flex flex-col">
        <p className="font-extrabold m-4">최근 검색어</p>
        <div className="flex flex-col">
          여기서부턴 최근 검색어들이 표시됩니다.
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default SearchPage;

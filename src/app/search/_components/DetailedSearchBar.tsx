import { category, categoryMapping } from '@/data/category';
import Link from 'next/link';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { IoIosArrowBack, IoMdCloseCircle } from 'react-icons/io';

type DetailedSearchBarProps = {
  inputRef: RefObject<HTMLInputElement>;
  inputOnclick: () => void;
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
};

const DetailedSearchBar = ({
  inputRef,
  inputOnclick,
  selectedCategory,
  setSelectedCategory,
}: DetailedSearchBarProps) => {
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Link href="/search">
          <IoIosArrowBack size={30} />
        </Link>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          ref={inputRef}
          className="border border-black rounded-full h-8 w-72 mt-1 mb-1 px-4"
          onClick={inputOnclick}
        />
        <button type="button" className="absolute right-14 top-2">
          <IoMdCloseCircle size={25} />
        </button>
        <Link href="/">
          <span className="mr-1">닫기</span>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex m-1 w-11/12 overflow-y-scroll scrollbar-hide">
          <div className="flex flex-row justify-center items-center">
            {category.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category ? null : category,
                  )
                }
                className={`w-16 h-10 mx-1 rounded-full border ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-gray-200'
                }`}
              >
                <span className="text-s">{categoryMapping[category]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailedSearchBar;

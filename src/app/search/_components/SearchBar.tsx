import Image from 'next/image';
import Link from 'next/link';
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

const iconLeft = '/images/ic-left.svg';
const iconclose = '/images/ic-xmark.svg';

type SearchBarProps = {
  register: UseFormRegister<{
    searchQuery: string;
    recentSearches: string[];
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      searchQuery: string;
      recentSearches: string[];
    },
    undefined
  >;
  handleSearch: () => void;
  setValue: UseFormSetValue<{
    searchQuery: string;
    recentSearches: string[];
  }>;
};

const SearchBar = ({
  register,
  setValue,
  handleSubmit,
  handleSearch,
}: SearchBarProps) => {
  return (
    <>
      <form
        onSubmit={handleSubmit(handleSearch)}
        className="flex flex-row items-center"
      >
        <Link href="/">
          <Image
            src={iconLeft}
            alt="left icon"
            width={24}
            height={24}
            className="ml-[20px] mr-[8px]"
          />
        </Link>
        <div className="flex flex-row justify-center items-center relative">
          <input
            {...register('searchQuery')}
            type="text"
            placeholder="나라와 카테고리 모두 검색할 수 있어요."
            className="bg-[#F9F9F9] rounded-[12px] text-[14px] h-[44px] w-[303px] mt-[6px] mb-[11px] py-[12px] px-[16px]"
          />
          <button
            type="button"
            className="absolute top-[16px] right-[10px]"
            onClick={() => setValue('searchQuery', '')}
          >
            <Image src={iconclose} alt="close icon" width={24} height={24} />
          </button>
        </div>
      </form>
    </>
  );
};
export default SearchBar;

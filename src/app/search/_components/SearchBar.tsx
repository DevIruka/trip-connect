import { Desktop, Mobile } from '@/components/ui/Responsive';
import Image from 'next/image';
import Link from 'next/link';
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import search from '@/data/images/ic-Search.svg';

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
  const { t } = useTranslation('search');
  return (
    <>
      <Mobile>
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="flex flex-row items-center justify-center w-full"
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
          <div className="flex flex-row justify-center items-center relative w-full max-w-[480px]">
            <input
              {...register('searchQuery')}
              type="text"
              placeholder={t('placeHolder')}
              className="bg-[#F9F9F9] rounded-[12px] text-[14px] h-[44px] w-full mt-[6px] mb-[11px] py-[12px] px-[16px] mr-[20px]"
            />
            <button
              type="button"
              className="absolute top-[16px] right-[28px]"
              onClick={() => setValue('searchQuery', '')}
            >
              <Image src={iconclose} alt="close icon" width={24} height={24} />
            </button>
          </div>
        </form>
      </Mobile>
      <Desktop>
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="flex flex-col max-w-[1200px] w-full relative"
        >
          <span className="text-[#44484c] text-[32px] font-bold font-['Pretendard'] leading-[51.20px] ml-[36px] md:mt-[40px]">
            {t('search')}
          </span>
          <div className="flex flex-row justify-center items-center relative w-full">
            <input
              {...register('searchQuery')}
              type="text"
              placeholder={t('placeHolder')}
              className="bg-[#F9F9F9] rounded-[12px] text-xl h-[70px] w-full max-w-[1128px] mt-[20px] mb-[11px] md:mb-[24px] py-[12px] pr-[16px] px-[42px] mx-[36px]"
            />
            <Image
              src={search}
              width={20}
              height={20}
              alt="search"
              className="absolute left-[50px] top-[45px] filter invert-[40%] brightness-[80%]"
            />
            <button
              type="button"
              className="absolute top-[16px] right-[10px]"
              onClick={() => setValue('searchQuery', '')}
            ></button>
          </div>
        </form>
      </Desktop>
    </>
  );
};
export default SearchBar;

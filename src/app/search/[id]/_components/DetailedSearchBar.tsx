import { category } from '@/data/category';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { KoreanCategory } from '@/utils/topics';
import Image from 'next/image';
import TabDetail from '../../_components/TabDetail';
import { convertToKorean } from '../../_utils/convertTopictoKorean';
import { useSearchStore } from '@/store/useSearchStore';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useTranslation } from 'react-i18next';
import { Desktop, Mobile } from '@/components/ui/Responsive';
import search from '@/data/images/ic-Search.svg';

const iconLeft = '/images/ic-left.svg';
const iconclose = '/images/ic-xmark.svg';

type DetailedSearchBarProps = {
  keyword: string | null;
  inputOnclick: () => void;
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<KoreanCategory | '전체'>>;
};

const DetailedSearchBar = ({
  keyword,
  inputOnclick,
  selectedCategory,
  setSelectedCategory,
}: DetailedSearchBarProps) => {
  const { t } = useTranslation('search');
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSelectedCategory('전체');
  }, [setSelectedCategory]);

  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''; // 입력 필드 초기화
    }
    setKeyword('');
  };

  return (
    <>
      <Mobile>
        <div className="flex flex-row items-center justify-center w-full">
          <Link href="/search">
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
              type="text"
              placeholder={t('placeHolder')}
              defaultValue={keyword!}
              ref={inputRef}
              className="bg-[#F9F9F9] rounded-[12px] text-[14px] h-[44px] w-full mt-[6px] mb-[11px] py-[12px] px-[16px]"
              onClick={inputOnclick}
            />
            <Image
              src={iconclose}
              alt="left icon"
              width={24}
              height={24}
              className="absolute top-[16px] right-[10px]"
              onClick={handleClearInput}
            />
          </div>
        </div>
      </Mobile>
      <Desktop>
        <div className="flex flex-col max-w-[1200px] w-full relative">
          <span className="text-[#44484c] text-[32px] font-bold font-['Pretendard'] leading-[51.20px] ml-[36px] md:mt-[40px]">
            {t('search')}
          </span>
          <div className="flex flex-row justify-center items-center relative w-full">
            <input
              type="text"
              placeholder={t('placeHolder')}
              defaultValue={keyword!}
              ref={inputRef}
              className="bg-[#F9F9F9] rounded-[12px] text-xl h-[70px] w-full max-w-[1128px] mt-[20px] mb-[11px] py-[12px] pr-[16px] px-[42px] mx-[36px]"
              onClick={inputOnclick}
            />
            <Image
              src={search}
              width={20}
              height={20}
              alt="search"
              className="absolute left-[50px] top-[45px] filter invert-[40%] brightness-[80%]"
            />
          </div>
        </div>
      </Desktop>
      <div className="w-full max-w-[1200px]">
        <div className="grid sticky top-[0px] bg-white z-10 max-w-[1200px] mx-auto">
          <div className="w-full overflow-auto whitespace-nowrap menuscrollbar px-[42px]">
            <Tabs
              value={selectedCategory ?? undefined}
              onValueChange={(value: string) =>
                setSelectedCategory(value as KoreanCategory | '전체')
              }
              className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex border-b border-[#dee1e5]"
            >
              <TabsList className="md:justify-between w-full flex">
                {category.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={convertToKorean(cat)}
                    className="px-3 py-2 text-sm"
                  >
                    <TabDetail category={cat} />
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};
export default DetailedSearchBar;

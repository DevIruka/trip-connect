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
      <div className="flex flex-row items-center">
        <Link href="/search">
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
            type="text"
            placeholder={t('placeHolder')}
            defaultValue={keyword!}
            ref={inputRef}
            className="bg-[#F9F9F9] rounded-[12px] text-[14px] h-[44px] w-[303px] mt-[6px] mb-[11px] py-[12px] px-[16px]"
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
      <div className="w-full px-5 border-b border-[#dee1e5] menuscrollbar">
        <Tabs
          value={selectedCategory ?? undefined}
          onValueChange={(value: string) =>
            setSelectedCategory(value as KoreanCategory | '전체')
          }
          className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex"
        >
          <TabsList>
            {category.map((cat) => (
              <TabsTrigger key={cat} value={convertToKorean(cat)}>
                <TabDetail category={cat} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};
export default DetailedSearchBar;

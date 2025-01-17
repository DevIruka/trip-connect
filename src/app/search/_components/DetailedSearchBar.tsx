import { category } from '@/data/category';
import Link from 'next/link';
import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { KoreanCategory } from '@/utils/topics';
import TabDetail from './TabDetail';
import { convertToKorean } from '../_utils/convertTopictoKorean';
import Image from 'next/image';

const iconLeft = '/images/ic-left.svg';
const iconclose = '/images/ic-xmark.svg';

type DetailedSearchBarProps = {
  inputRef: RefObject<HTMLInputElement>;
  inputOnclick: () => void;
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<KoreanCategory | '전체'>>;
};

const DetailedSearchBar = ({
  inputRef,
  inputOnclick,
  selectedCategory,
  setSelectedCategory,
}: DetailedSearchBarProps) => {
  useEffect(() => {
    setSelectedCategory('전체');
  }, [setSelectedCategory]);

  const handleCategoryChange = (
    _: React.SyntheticEvent,
    newValue: string | null,
  ) => {
    setSelectedCategory((prev) =>
      prev === newValue ? '전체' : (newValue as KoreanCategory | '전체'),
    );
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
            placeholder="나라와 카테고리 모두 검색할 수 있어요."
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
          />
        </div>
      </div>
      <Box>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="category filter tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: 'black', // 밑줄 색상을 검은색으로 변경
            },
          }}
          sx={{
            overflowX: 'auto', // 수평 스크롤 허용
            '& .MuiTabs-scrollButtons': {
              width: 'auto', // 스크롤 버튼 너비 조정
            },
          }}
        >
          {category.map((category) => (
            <Tab
              key={category}
              label={<TabDetail category={category} />}
              value={convertToKorean(category)} // Tab의 고유 값
              sx={{
                height: '28',
                padding: '4px 8px', // 위아래 간격 줄이기
                fontSize: '16px', // 텍스트 크기 조정
                '&.Mui-selected': {
                  color: '#000000',
                },
                '&:hover': {
                  backgroundColor: '#f0f0f0', // 기본 탭에 호버 색상 변경
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
    </>
  );
};
export default DetailedSearchBar;

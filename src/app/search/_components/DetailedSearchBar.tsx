import { category } from '@/data/category';
import Link from 'next/link';
import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Tabs, Tab, Box } from '@mui/material';
import { KoreanCategory } from '@/utils/topics';

type DetailedSearchBarProps = {
  inputRef: RefObject<HTMLInputElement>;
  inputOnclick: () => void;
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<KoreanCategory | "전체">>;
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
    // 선택된 카테고리가 클릭된 것과 같으면 해제(null), 아니면 업데이트
    setSelectedCategory((prev) => 
      prev === newValue ? '전체' : (newValue as KoreanCategory | "전체")
    );
  };
  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Link href="/search">
          <IoIosArrowBack size={30} />
        </Link>
        <div className="flex flex-row justify-center items-center relative">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            ref={inputRef}
            className="border border-black rounded-full h-8 w-72 mt-1 mb-1 px-4"
            onClick={inputOnclick}
          />
          <Link href="/">
            <span className="ml-2">닫기</span>
          </Link>
        </div>
      </div>
      <Box className="flex items-center justify-center">
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
              label={category}
              value={category} // Tab의 고유 값
              sx={{
                height: '28',
                padding: '4px 8px', // 위아래 간격 줄이기
                fontSize: '0.85rem', // 텍스트 크기 조정
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

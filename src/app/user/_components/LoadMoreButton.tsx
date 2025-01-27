import React from 'react';

interface LoadMoreButtonProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onClick: () => void;
  children?: React.ReactNode; // 버튼 내부 텍스트를 커스텀할 수도 있음
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  hasNextPage,
  isFetchingNextPage,
  onClick,
  children,
}) => {
  if (!hasNextPage) return null; // 다음 페이지가 없으면 버튼을 렌더링하지 않음
  return (
    <div className="flex flex-row justify-center">
      <button
        onClick={onClick}
        disabled={isFetchingNextPage}
        className="w-[335px] h-11 px-3 py-1.5 rounded-[100px] border border-[#dee1e5] justify-center items-center gap-2.5 inline-flex mt-[20px]"
      >
        {isFetchingNextPage ? '검색 결과 로드 중' : children || '더보기'}
      </button>
    </div>
  );
};

export default LoadMoreButton;

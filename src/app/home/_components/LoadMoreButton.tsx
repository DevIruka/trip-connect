import React from 'react';

type LoadMoreButtonProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  if (!hasNextPage) return null;

  return (
    <div className="px-5 flex justify-center">
      <button
        onClick={fetchNextPage}
        disabled={isFetchingNextPage}
        className="gray-btn"
      >
        {isFetchingNextPage ? '로딩 중...' : '더보기'}
      </button>
    </div>
  );
};

export default LoadMoreButton;

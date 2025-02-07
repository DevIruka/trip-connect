import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('home');
  if (!hasNextPage) return null;

  return (
    <div className="px-5 flex justify-center">
      <button
        onClick={fetchNextPage}
        disabled={isFetchingNextPage}
        className="gray-btn"
      >
        {isFetchingNextPage ? t('loading') : t('loadMore')}
      </button>
    </div>
  );
};

export default LoadMoreButton;

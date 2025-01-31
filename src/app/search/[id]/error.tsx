'use client';

import ErrorTemplate from '@/components/ErrorTemplate';

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return <ErrorTemplate title="검색 페이지 로드 중 오류가 발생하였습니다." />;
};
export default ErrorPage;

'use client';

import ErrorTemplate from '@/components/ErrorTemplate';
import { useTranslation } from 'react-i18next';

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const { t } = useTranslation();
  return <ErrorTemplate title={t('error.search')} />;
};
export default ErrorPage;

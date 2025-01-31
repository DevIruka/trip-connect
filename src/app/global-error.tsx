'use client';

import ErrorTemplate from '@/components/ErrorTemplate';

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <html>
      <body>
        <ErrorTemplate />
      </body>
    </html>
  );
};

export default ErrorPage;

import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xailyedpvaueladwiqrg.supabase.co',
      },
    ],
  },
  experimental: {
    appDir: true, // App Directory 활성화
  },
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'en',
    localeDetection: false,
    localePrefix: 'never',
  },
};

// Bundle Analyzer 설정
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true', // 환경변수로 활성화 여부 설정
});

// Sentry 설정
const sentryOptions = {
  org: 'sparta-65',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

// 두 개의 설정 조합
export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryOptions);

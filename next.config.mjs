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

export default nextConfig;

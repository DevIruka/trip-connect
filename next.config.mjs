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
};

export default nextConfig;

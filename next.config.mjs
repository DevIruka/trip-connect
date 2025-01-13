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
};

export default nextConfig;

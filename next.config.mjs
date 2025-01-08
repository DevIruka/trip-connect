/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*', // 클라이언트에서 호출하는 URL
            destination: '/response/api/:path*', // 실제 파일 경로
          },
        ];
      },
};

export default nextConfig;

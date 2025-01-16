import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Providers from './providers';

const pretendard = localFont({
  src: './fonts/Pretendard-Regular.woff',
  variable: '--pretendard',
  weight: '400',
});

// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// });

export const metadata: Metadata = {
  title: 'Trip Connector',
  description: '트립 커넥터, 여행을 연결해줍니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className={`${pretendard.variable} antialiased`}
      >
        <div className="bg-container">
          <Providers>
            <Header />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Providers from './providers';
//import '@/app/i18n';

// const pretendard = localFont({
//   src: './fonts/PretendardVariable.woff2',
//   display: 'swap',
//   weight: '100 900',
//   variable: '--font-pretendard',
// });

export const metadata: Metadata = {
  title: 'Hey!Local',
  description: 'Hey!Local',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
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

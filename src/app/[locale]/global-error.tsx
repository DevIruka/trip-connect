'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const siren = '/images/siren.svg';

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const route = useRouter();
  return (
    // global-error must include html and body tags
    <html>
      <body>
      <div className="inner menuscrollbar">
      <div className="w-full h-[257px] flex-col justify-start items-center inline-flex">
        <div className="mt-[128px] self-stretch h-[125px] flex-col justify-start items-center flex">
          <Image src={siren} width={100} height={100} alt="warning" />
          <div className="mt-[32px] self-stretch text-center text-[#44484c] text-xl font-bold font-['Pretendard']">
            이런! 페이지를 찾을 수 없어요.
          </div>
          <div className="mt-[15px] text-center text-[#797c80] text-base font-medium font-['Pretendard'] leading-relaxed">
            이 페이지는 사라졌거나
            <br />
            다른 페이지로 변경되었어요.
            <br />
            주소를 다시 확인해 주세요.
          </div>
          <div className="mt-[50px] flex flex-row gap-[8px]">
            <button
              onClick={() => {
                route.back();
              }}
              className="h-[52px] min-w-[163.5px] px-3 py-1.5 bg-[#f4f6f9] rounded-xl justify-center items-center gap-2.5 inline-flex"
            >
              이전으로
            </button>
            <Link href={'/'}>
              <div className="h-[52px] min-w-[163.5px] px-3 py-1.5 bg-[#eaf4ff] rounded-xl justify-center items-center gap-2.5 inline-flex">
                홈으로
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
      </body>
    </html>
  )
}

export default ErrorPage;

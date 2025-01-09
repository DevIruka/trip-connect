import Link from 'next/link';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="grid">
        <div className="flex gap-4">
          <Link href={`/request`}>질문하기</Link>
          <Link href={`/request`}>답변하기</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/">전체보기</Link>
          <Link href="/food">맛집</Link>
          <Link href="/place">장소</Link>
          <Link href="/shelter">숙소</Link>
          <Link href="/event">이벤트</Link>
          <Link href="/date-price">일정/경비</Link>
        </div>
      </header>
      {children}
    </>
  );
}

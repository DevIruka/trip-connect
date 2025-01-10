import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="grid gap-4 sticky">
      <div>
        <Link href="/">전체보기</Link>
        <Link href="/food">맛집</Link>
        <Link href="/place">장소</Link>
        <Link href="/shelter">숙소</Link>
        <Link href="/event">이벤트</Link>
        <Link href="/date-price">일정/경비</Link>
      </div>
      <div className="flex place-content-between">
        <div className="flex gap-4">
          <button>최신</button>
          <button>질문</button>
          <button>답변</button>
        </div>
        <button>나라 선택하기</button>
      </div>
    </nav>
  );
};

export default Navbar;

import { topicMapping } from '@/utils/topics';
import Link from 'next/link';

const Navbar = () => {
  const topicArr = Object.entries(topicMapping);
  return (
    <nav className="grid sticky top-[0px] bg-white z-10">
      <div className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex gap-4 pl-5">
        <Link href="/" className="flex items-center">
          전체보기
        </Link>
        {topicArr.map(([key, value]) => (
          <Link href={`/${value}`} className="flex items-center" key={key}>
            {key}
          </Link>
        ))}
      </div>
      <div className="flex h-16 justify-between px-5">
        <div className="flex gap-2">
          <button className="menu-btn">최신</button>
          <button className="menu-btn">질문</button>
          <button className="menu-btn">답변</button>
        </div>
        <button>나라 선택하기</button>
      </div>
    </nav>
  );
};

export default Navbar;

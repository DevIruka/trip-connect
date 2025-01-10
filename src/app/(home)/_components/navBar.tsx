import { topicMapping } from '@/utils/topics';
import Link from 'next/link';

const Navbar = () => {
  const topicArr = Object.entries(topicMapping);
  return (
    <nav className="grid gap-4 sticky top-[0px] bg-white">
      <div className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex gap-4">
        <Link href="/" className="w-[100px]">
          전체보기
        </Link>
        {topicArr.map(([key, value]) => (
          <Link href={`/${value}`} className="w-[100px]" key={key}>
            {key}
          </Link>
        ))}
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

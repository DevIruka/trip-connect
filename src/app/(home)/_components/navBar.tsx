import { topicMapping } from '@/utils/topics';

const Navbar = ({ setFilterType, changeCategory }) => {
  const topicArr = Object.entries(topicMapping);
  return (
    <nav className="grid sticky top-[0px] bg-white z-10">
      <div className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex gap-4 pl-5">
        <button
          onClick={() => changeCategory('all')}
          className="flex items-center"
        >
          전체보기
        </button>
        {topicArr.map(([key, value]) => (
          <button
            onClick={() => changeCategory(value)}
            className="flex items-center"
            key={key}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex h-16 justify-between px-5">
        <div className="flex gap-2">
          <button className="menu-btn" onClick={() => setFilterType('latest')}>
            최신
          </button>
          <button className="menu-btn" onClick={() => setFilterType('request')}>
            질문
          </button>
          <button
            className="menu-btn"
            onClick={() => setFilterType('response')}
          >
            답변
          </button>
        </div>
        <button>나라 선택하기</button>
      </div>
    </nav>
  );
};

export default Navbar;

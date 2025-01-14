import { topicMapping } from '@/utils/topics';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Navbar = ({ setFilterType, changeCategory, category }) => {
  const topicArr = Object.entries(topicMapping);
  return (
    <div className="grid sticky top-[0px] bg-white z-10">
      <Tabs
        defaultValue={category}
        className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex gap-5 pl-5"
      >
        <TabsList className="bg-transparent h-full border-0">
          <TabsTrigger
            value="all"
            onClick={() => changeCategory('all')}
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
          >
            전체보기
          </TabsTrigger>
          {topicArr.map(([key, value]) => (
            <TabsTrigger
              value={value}
              onClick={() => changeCategory(value)}
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
              key={key}
            >
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
    </div>
  );
};

export default Navbar;

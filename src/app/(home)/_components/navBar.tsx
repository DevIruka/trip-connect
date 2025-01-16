import { topicMapping } from '@/utils/topics';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Modal } from './LocationModal';
import Icon from '@/components/icons';

const Navbar = ({
  setFilterType,
  changeCategory,
  category,
  setNationFilter,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('selectedLocation'))
      : null;
  }); // 선택된 나라 관리
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const topicArr = Object.entries(topicMapping);

  const getSelectedCountryLabel = (selectedCountry) => {
    if (!selectedCountry) {
      return '나라 선택하기';
    }

    if (!selectedCountry.city) {
      return selectedCountry.country;
    }

    return `${selectedCountry.country}, ${selectedCountry.city}`;
  };

  return (
    <div className="grid sticky top-[0px] bg-white z-10">
      <Tabs
        defaultValue={category}
        className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex gap-5 pl-5"
      >
        <TabsList className="bg-transparent h-full border-0 flex gap-5">
          <TabsTrigger
            value="all"
            onClick={() => changeCategory('all')}
            className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
          >
            <Icon type={'all'} size={20} />
            전체보기
          </TabsTrigger>
          {topicArr.map(([key, value]) => (
            <TabsTrigger
              value={value}
              onClick={() => changeCategory(value)}
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
              key={key}
            >
              <Icon type={value} size={20} />
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

        <button
          className="menu-btn"
          onClick={() => setIsModalOpen(true)} // 모달 열기
        >
          {isHydrated && getSelectedCountryLabel(selectedCountry)}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        setCountry={(country) => {
          setSelectedCountry(country); // 선택된 나라 업데이트
          setNationFilter(country);
        }}
      />
    </div>
  );
};

export default Navbar;

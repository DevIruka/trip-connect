import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { topicMapping } from '@/utils/topics';


import { LocationModal } from '../../../components/LocationModalNew';
import { nation } from '../_types/homeTypes';
import updown from '@/data/images/ic-up&down.svg';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Icon from '@/components/Icons';


type Props = {
  setFilterType: React.Dispatch<React.SetStateAction<string>>;
  changeCategory: (category: string) => void;
  setNationFilter: React.Dispatch<React.SetStateAction<nation | null>>;
  filterType: string;
};

const Navbar = ({
  setFilterType,
  changeCategory,
  setNationFilter,
  filterType,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 관리
  const [selectedCountry, setSelectedCountry] = useState<nation | null>(() => {
    return typeof window !== 'undefined'
      ? JSON.parse(sessionStorage.getItem('selectedLocation')!)
      : null;
  }); // 선택된 나라 관리
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const topicArr = Object.entries(topicMapping);

  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const getSelectedCountryLabel = (selectedCountry: nation | null) => {
    if (!selectedCountry) {
      return '나라/도시';
    }
    if (!selectedCountry.city) {
      return selectedCountry.country;
    }

    return `${selectedCountry.country}/${selectedCountry.city}`;
  };

  return (
    <div className="grid sticky top-[0px] bg-white z-10">
      <div className="w-full overflow-auto whitespace-nowrap menuscrollbar border-b border-[#dee1e5] px-5">
        <Tabs
          defaultValue={category}
          className="h-12 overflow-auto whitespace-nowrap menuscrollbar flex"
        >
          <TabsList>
            <TabsTrigger value="all" onClick={() => changeCategory('all')}>
              <Icon type={'all'} size={20} />
              <div className="pl-1">전체</div>
            </TabsTrigger>
            {topicArr.map(([key, value]) => (
              <TabsTrigger
                value={value}
                onClick={() => changeCategory(value)}
                key={key}
              >
                <Icon type={value} size={20} />
                <div className="pl-1">{key}</div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex h-[68px] justify-between px-5 py-4">
        <div className="flex gap-1">
          <button
            className={
              filterType === 'latest' ? 'menu-selected-btn' : 'menu-btn'
            }
            onClick={() => setFilterType('latest')}
          >
            전체
          </button>
          <button
            className={
              filterType === 'request' ? 'menu-selected-btn' : 'menu-btn'
            }
            onClick={() => setFilterType('request')}
          >
            질문
          </button>
          <button
            className={
              filterType === 'response' ? 'menu-selected-btn' : 'menu-btn'
            }
            onClick={() => setFilterType('response')}
          >
            답변
          </button>
        </div>

        <button
          className={`menu-dropdown-btn max-w-[122px] font-semibold text-sm ${
            isHydrated && selectedCountry ? 'text-[#0079f2]' : 'text-[#797c80]'
          }`}
          onClick={() => setIsModalOpen(true)} // 모달 열기
        >
          <div className="truncate max-w-[68px]">
            {isHydrated && getSelectedCountryLabel(selectedCountry)}
          </div>
          <Image
            className=""
            src={updown}
            alt={'dropdown arrow'}
            width={16}
            height={16}
          />
        </button>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        setCountry={(country: nation | null) => {
          setSelectedCountry(country); // 선택된 나라 업데이트
          setNationFilter(country);
        }}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

export default Navbar;

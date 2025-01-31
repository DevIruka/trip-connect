import { useLang } from '@/store/languageStore';
import React from 'react';

const TABS = [
  { id: 'responses', label: '답변' },
  { id: 'requests', label: '질문' },
  { id: 'reviews', label: '리뷰' },
];

const translatedTabs = [
  { id: 'responses', label: 'Response' },
  { id: 'requests', label: 'Request' },
  { id: 'reviews', label: 'Review' },
];

type TabNavigationProps = {
  activeTab: 'responses' | 'requests' | 'reviews';
  setActiveTab: (tab: 'responses' | 'requests' | 'reviews') => void;
  counts: { responses: number; requests: number; reviews: number };
};
const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  counts,
}) => {
  const { lang } = useLang();
  const tabsToUse = lang === 'en' ? translatedTabs : TABS;
  return (
    <div className="flex justify-between px-5 pt-[27px] border-b border-[#DFE1E5] gap-2">
      {tabsToUse.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-3 text-center ${
            activeTab === tab.id ? 'border-b-2 border-black' : ''
          }`}
          onClick={() =>
            setActiveTab(tab.id as 'responses' | 'requests' | 'reviews')
          }
        >
          <span className="text-[16px] font-semibold">{tab.label}</span>
          <span className="ml-1 text-[#80BFFF]">
            {counts[tab.id as keyof typeof counts]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;

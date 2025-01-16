'use client';

import React from 'react';

type FilterTabsProps = {
  activeFilter: 'all' | 'question' | 'answer';
  onChangeFilter: (filter: 'all' | 'question' | 'answer') => void;
};

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onChangeFilter,
}) => {
  const tabs = [
    { key: 'all', label: '전체' },
    { key: 'question', label: '질문' },
    { key: 'answer', label: '답변' },
  ];

  return (
    <div className="flex justify-center gap-4 my-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() =>
            onChangeFilter(tab.key as 'all' | 'question' | 'answer')
          }
          className={`flex justify-center items-center gap-2 px-4 py-2 h-9 rounded-full border transition-all duration-300 ${
            activeFilter === tab.key
              ? 'border-black bg-black text-white'
              : 'border-[#DFE1E5] bg-transparent text-black'
          } hover:bg-gray-200`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;

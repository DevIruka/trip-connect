'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormInputs } from '../_types/form';
import Icon from '@/components/Icons';
import { useLang } from '@/store/languageStore';
import { capitalizeFirstLetter } from '@/app/search/_utils/capitalize';

type Props = {
  topics: string[];
  setValue?: UseFormSetValue<FormInputs>;
  watch?: UseFormWatch<FormInputs>;
  selectedCategories?: string[];
  disabled?: boolean;
  isSingleSelect?: boolean;
};

const TopicSelector: React.FC<Props> = ({
  topics = [],
  setValue,
  watch,
  selectedCategories = [],
  disabled = false,
  isSingleSelect = false,
}) => {
  const topicIcons: Record<string, string> = {
    맛집: 'food',
    쇼핑: 'shopping',
    숙소: 'lodging',
    이벤트: 'event',
    '일정/경비': 'schedule-expenses',
    문화: 'culture',
    역사: 'history',
    액티비티: 'activity',
    기타: 'etc',
  };

  const handleTopicClick = (topic: string, currentTopics: string[]) => {
    if (disabled || !setValue) return;

    const updatedTopics = isSingleSelect
      ? [topic]
      : currentTopics.includes(topic)
      ? currentTopics.filter((t) => t !== topic)
      : [...currentTopics, topic];

    setValue('category', updatedTopics, { shouldValidate: true });
  };

  const currentCategories = watch
    ? watch('category') || selectedCategories
    : selectedCategories;

  const { lang } = useLang();

  return (
    <div className="flex flex-wrap gap-[8px]">
      {topics.map((topic) => {
        const isSelected = currentCategories.includes(topic);
        const iconType = topicIcons[topic] || 'etc'; // 매핑되지 않은 경우 기본 아이콘
        return (
          <button
            key={topic}
            type="button"
            disabled={disabled} // 버튼 비활성화 여부
            onClick={() => handleTopicClick(topic, currentCategories || [])} // 클릭 처리
            className={`px-3 py-1.5 gap-[4px] border rounded-full font-semibold text-sm flex items-center md:px-[16px] md:py-[7px] md:text-m md:min-w-[80px] md:text-base md:min-h-[46px] ${
              isSelected
                ? disabled
                  ? 'bg-[#DFE1E5] text-[#797C80] cursor-not-allowed' // 비활성화 + 선택된 상태
                  : 'bg-black text-white cursor-pointer' // 선택된 상태
                : disabled
                ? 'bg-white text-[#797C80] border-gray-300 cursor-not-allowed' // 비활성화 상태
                : 'bg-white text-[#797C80] border-gray-300 hover:bg-black hover:text-white' // 활성화 상태
            }`}
          >
            <Icon type={iconType} size={16} />
            <span>
              {lang === 'ko' ? topic : capitalizeFirstLetter(topicIcons[topic])}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TopicSelector;

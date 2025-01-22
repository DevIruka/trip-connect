'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormInputs } from '../_types/form';

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
    맛집: '🥘',
    쇼핑: '🛍️',
    숙소: '🛏️',
    이벤트: '🎉',
    '일정/경비': '💰️',
    문화: '🌏️',
    역사: '📚️',
    액티비티: '🎿',
    기타: '⁉️',
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

  return (
    <div className="flex flex-wrap gap-[8px]">
      {topics.map((topic) => {
        const isSelected = currentCategories.includes(topic);

        return (
          <button
            key={topic}
            type="button"
            disabled={disabled} // 버튼 비활성화 여부
            onClick={() => handleTopicClick(topic, currentCategories || [])} // 클릭 처리
            className={`px-3 py-1.5 border rounded-full font-semibold text-sm ${
              isSelected
                ? disabled
                  ? 'bg-[#DFE1E5] text-[#797C80] cursor-not-allowed' // 비활성화 + 선택된 상태
                  : 'bg-black text-white cursor-pointer' // 선택된 상태
                : disabled
                ? 'bg-white text-[#797C80] border-gray-300 cursor-not-allowed' // 비활성화 상태
                : 'bg-white text-[#797C80] border-gray-300 hover:bg-black hover:text-white' // 활성화 상태
            }`}
          >
            <span>{topicIcons[topic] || '❓'}</span> {topic}
          </button>
        );
      })}
    </div>
  );
};

export default TopicSelector;

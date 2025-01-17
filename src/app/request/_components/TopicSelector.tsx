'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormInputs } from '../_types/form';

type Props = {
  topics: string[];
  setValue: UseFormSetValue<FormInputs>;
  watch: UseFormWatch<FormInputs>;
  disabled?: boolean;
  selectedButtonStyles?: {
    backgroundColor: string;
    color: string;
  };
};

const TopicSelector: React.FC<Props> = ({
  topics = [],
  setValue,
  watch,
  disabled = false,
  selectedButtonStyles = {
    backgroundColor: '#DFE1E5',
    color: '#797C80',
  },
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
    if (disabled) return;
    const updatedTopics = currentTopics.includes(topic)
      ? currentTopics.filter((t) => t !== topic)
      : [...currentTopics, topic];

    setValue('category', updatedTopics, { shouldValidate: true }); // category 업데이트
  };

  return (
    <div className="flex flex-wrap gap-[8px]">
      {topics.map((topic) => (
        <button
          key={topic}
          type="button"
          disabled={disabled}
          className={`px-[12px] py-[7px] text-[14px] font-semibold border border-[#DFE1E5] rounded-full ${
            disabled
              ? 'bg-[#DFE1E5] text-[#797C80] cursor-not-allowed' // 비활성화 상태
              : (watch('category') || []).includes(topic)
              ? 'bg-black text-white' 
              : 'bg-white text-[#797C80] hover:bg-black hover:text-white transition'
          }`}
          onClick={() => handleTopicClick(topic, watch('category') || [])}
        >
          <span className="mr-[4px]">{topicIcons[topic] || '❓'}</span>
          <span>{topic}</span>
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;

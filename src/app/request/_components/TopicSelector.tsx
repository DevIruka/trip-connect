'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormInputs } from '../_types/form';

type Props = {
  topics: string[];
  setValue: UseFormSetValue<FormInputs>;
  watch: UseFormWatch<FormInputs>;
};

const TopicSelector: React.FC<Props> = ({ topics = [], setValue, watch }) => {
  const handleTopicClick = (topic: string, currentTopics: string[]) => {
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
          className={`px-[12px] py-[7px] text-[14px] font-semibold border border-[#DFE1E5] rounded-full ${
            (watch('category') || []).includes(topic)
              ? 'bg-black text-white'
              : 'bg-white text-[#797C80]'
          } hover:bg-black hover:text-white transition`}
          onClick={() => handleTopicClick(topic, watch('category') || [])}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;

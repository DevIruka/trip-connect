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

    setValue('category', updatedTopics); // category 업데이트
  };

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <button
          key={topic}
          type="button"
          className={`px-3 py-1 text-sm border rounded-full ${
            (watch('category') || []).includes(topic)
              ? 'bg-black text-white'
              : 'bg-[#E5E5EC] text-black'
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

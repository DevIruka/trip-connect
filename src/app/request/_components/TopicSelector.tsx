'use client';

import React, { useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormInputs } from '../_types/form';

type Props = {
  topics: string[];
  additionalTopics: string[];
  setValue: UseFormSetValue<FormInputs>;
  watch: UseFormWatch<FormInputs>;
};

const TopicSelector: React.FC<Props> = ({
  topics = [],
  additionalTopics = [],
  setValue,
  watch,
}) => {
  const [isMoreVisible, setIsMoreVisible] = useState(false);

  const toggleMore = () => {
    setIsMoreVisible((prev) => !prev);
  };

  const handleTopicClick = (topic: string, currentTopics: string[]) => {
    const updatedTopics = currentTopics.includes(topic)
      ? currentTopics.filter((t) => t !== topic)
      : [...currentTopics, topic];

    setValue('category', updatedTopics); // category 업데이트
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
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

        <button
          type="button"
          className="text-black text-sm hover:underline flex items-center gap-1"
          onClick={toggleMore}
        >
          더보기
          <span
            className={`transform transition-transform ${
              isMoreVisible ? 'rotate-180' : ''
            }`}
          >
            ⌄
          </span>
        </button>
      </div>

      {/* 더보기 클릭 시 나타나는 하위 리스트 */}
      {isMoreVisible && (
        <div className="flex flex-wrap gap-3 mt-2">
          {additionalTopics.map((subTopic) => (
            <button
              key={subTopic}
              type="button"
              onClick={() =>
                handleTopicClick(subTopic, watch('category') || [])
              }
              className={`px-3 py-1 text-sm border rounded-full ${
                (watch('category') || []).includes(subTopic)
                  ? 'bg-black text-white'
                  : 'bg-[#E5E5EC] text-black'
              } hover:bg-black hover:text-white transition`}
            >
              {subTopic}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicSelector;

'use client';

import React, { useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormInputs } from '../_types/form';

type Props = {
  topics: string[];
  additionalTopics: string[];
  register: UseFormRegister<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
};

const TopicSelector: React.FC<Props> = ({
  topics,
  additionalTopics,
  register,
  setValue,
}) => {
  const [isMoreVisible, setIsMoreVisible] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleMore = () => {
    setIsMoreVisible((prev) => !prev);
  };

  const handleTopicClick = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      // 이미 선택된 경우, 배열에서 제거
      const updatedTopics = selectedTopics.filter((t) => t !== topic);
      setSelectedTopics(updatedTopics);
      setValue('category', updatedTopics); // 배열 업데이트
    } else {
      // 선택되지 않은 경우, 배열에 추가
      const updatedTopics = [...selectedTopics, topic];
      setSelectedTopics(updatedTopics);
      setValue('category', updatedTopics); // 배열 업데이트
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className={`px-4 py-2 border rounded ${
              selectedTopics.includes(topic) ? 'bg-blue-200' : 'bg-gray-100'
            } hover:bg-gray-200`}
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </button>
        ))}

        <button
          type="button"
          className="flex items-center gap-1 text-gray-600 hover:underline"
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
              onClick={() => handleTopicClick(subTopic)}
              className={`px-4 py-2 border rounded ${
                selectedTopics.includes(subTopic)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              {...register('category')}
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

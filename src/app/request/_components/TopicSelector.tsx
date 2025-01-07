'use client';

import React, { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { FormInputs } from '../_types/form';

type Props = {
  topics: string[];
  additionalTopics: string[];
  register: UseFormRegister<FormInputs>;
};

const TopicSelector: React.FC<Props> = ({
  topics,
  additionalTopics,
  register,
}) => {
  const [isMoreVisible, setIsMoreVisible] = useState(false);

  const toggleMore = () => {
    setIsMoreVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            className="px-3 py-2 border rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
            {...register('topic')}
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
        <div className="flex flex-wrap gap-2 mt-2">
          {additionalTopics.map((subTopic) => (
            <button
              key={subTopic}
              type="button"
              className="px-3 py-2 border rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
              {...register('topic')}
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

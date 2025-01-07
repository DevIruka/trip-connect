'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';

type Props = {
  topics: string[];
  register: UseFormRegister<any>;
};

const TopicSelector: React.FC<Props> = ({ topics, register }) => {
  return (
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
    </div>
  );
};

export default TopicSelector;

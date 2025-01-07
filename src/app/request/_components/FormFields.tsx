'use client';

import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';

type Props = {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
};

const FormFields: React.FC<Props> = ({ register, watch }) => {
  return (
    <>
      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">제목</label>
        <input
          type="text"
          placeholder="글 제목"
          {...register('title', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      {/* 크레딧 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">크레딧</label>
        <input
          type="number"
          placeholder="크레딧을 입력해주세요"
          {...register('credit', { required: true, min: 1 })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      {/* 내용 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">내용</label>
        <textarea
          placeholder="내용을 입력해주세요"
          {...register('content', { required: true, maxLength: 200 })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
        <p className="text-right text-sm text-gray-400">
          {watch('content')?.length || 0}/200
        </p>
      </div>

      {/* 기한 선택 */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">기한</label>
        <input
          type="date"
          {...register('deadline', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>
    </>
  );
};

export default FormFields;

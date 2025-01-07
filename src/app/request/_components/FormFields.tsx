'use client';

import React from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { FormInputs } from '../_types/form';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type Props = {
  register: UseFormRegister<FormInputs>;
  watch: UseFormWatch<FormInputs>;
  control: Control<FormInputs>;
};

const FormFields: React.FC<Props> = ({ register, watch, control }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">제목</label>
        <input
          type="text"
          placeholder="글 제목"
          {...register('title', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">크레딧</label>
        <input
          type="number"
          placeholder="크레딧을 입력해주세요"
          {...register('credit', { required: true, min: 1 })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>

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

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">기한</label>
        <Controller
          name="deadline"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <div>
              <DayPicker
                mode="single"
                selected={field.value} 
                onSelect={field.onChange} 
                className="rounded border border-gray-300 p-2"
              />
              {field.value && (
                <p className="mt-2 text-sm text-gray-500">
                  선택된 날짜: {format(new Date(field.value), 'yyyy-MM-dd')}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </>
  );
};

export default FormFields;

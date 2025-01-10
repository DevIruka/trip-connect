'use client';

import React, { useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import { FormInputs } from '../_types/form';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { FaCalendarAlt } from 'react-icons/fa';

type Props = {
  register: UseFormRegister<FormInputs>;
  watch: UseFormWatch<FormInputs>;
  control: Control<FormInputs>;
  errors: FieldErrors<FormInputs>;
};

const FormFields: React.FC<Props> = ({ register, watch, control, errors }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; // 높이를 초기화
    e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 맞게 높이 조정
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">제목</label>
        <input
          type="text"
          placeholder="글 제목"
          {...register('title', { required: '제목을 입력해주세요.' })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">크레딧</label>
        <input
          type="number"
          placeholder="크레딧을 입력해주세요"
          {...register('credit', {
            required: '크레딧을 입력해주세요.',
            min: {
              value: 0,
              message: '크레딧은 0 이상이어야 합니다.',
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
        />
        {errors.credit && (
          <p className="text-sm text-red-500 mt-1">{errors.credit.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">내용</label>
        <textarea
          placeholder="내용을 입력해주세요"
          {...register('content', {
            required: '내용을 입력해주세요.',
            maxLength: {
              value: 200,
              message: '내용은 200자 이하여야 합니다.',
            },
          })}
          onInput={handleInputResize} // 입력 시 높이 조정
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none resize-none overflow-hidden"
          style={{ height: 'auto', minHeight: '100px' }} // 초기 높이 설정
        />
        {errors.content && (
          <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
        )}
        <p className="text-right text-sm text-gray-400">
          {watch('content')?.length || 0}/200
        </p>
      </div>

      <div className="mb-4 relative">
        <label className="block text-sm font-bold mb-2">기한</label>
        <Controller
          name="date_end"
          control={control}
          defaultValue={undefined}
          rules={{ required: '기한을 선택해주세요.' }}
          render={({ field }) => {
            const today = new Date();
            return (
              <>
                <div className="relative flex items-center">
                  <FaCalendarAlt
                    className="absolute left-3 text-black pointer-events-none"
                    size={20} // 아이콘 크기
                  />
                  <input
                    type="text"
                    placeholder="yyyy/mm/dd"
                    value={
                      field.value
                        ? format(new Date(field.value), 'yyyy/MM/dd')
                        : ''
                    }
                    readOnly
                    onClick={toggleCalendar}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded focus:outline-none"
                  />
                </div>
                {errors.date_end && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.date_end.message}
                  </p>
                )}

                {isCalendarOpen && (
                  <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                    <DayPicker
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date || undefined)}
                      disabled={{
                        before: today,
                      }}
                      modifiers={{
                        highlight: {
                          from: today,
                          to: field.value ? new Date(field.value) : undefined,
                        },
                      }}
                      modifiersClassNames={{
                        highlight: 'bg-blue-200',
                      }}
                    />
                    <button
                      type="button"
                      className="mt-2 w-full bg-black text-white py-1 rounded hover:bg-gray-800"
                      onClick={toggleCalendar}
                    >
                      확인
                    </button>
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default FormFields;

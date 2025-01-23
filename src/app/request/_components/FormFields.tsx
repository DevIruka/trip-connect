'use client';

import React, { useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { FormInputs } from '../_types/form';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import CalendarIcon from './icons/CalendarIcon';

type Props = {
  register: UseFormRegister<FormInputs>;
  watch: UseFormWatch<FormInputs>;
  control: Control<FormInputs>;
  errors: FieldErrors<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  disabledFields: {
    title: boolean;
    credit: boolean;
    content: boolean;
    date_end: boolean;
  };
};

const FormFields: React.FC<Props> = ({
  register,
  watch,
  errors,
  setValue,
  disabledFields,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    watch('date_end') ? new Date(String(watch('date_end'))) : undefined,
  );

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  const handleCancel = () => {
    setIsCalendarOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      setValue('date_end', selectedDate);
    }
    setIsCalendarOpen(false);
  };

  React.useEffect(() => {
    const dateEndValue = watch('date_end');
    if (dateEndValue) {
      setSelectedDate(new Date(String(dateEndValue)));
    }
  }, [watch('date_end')]);

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; // 높이를 초기화
    e.target.style.height = `${e.target.scrollHeight}px`; // 내용에 맞게 높이 조정
  };

  return (
    <>
      <div className="flex flex-col gap-[28px]">
        <div className="flex flex-col items-start gap-[8px]">
          <label className="text-sm font-semibold text-[13px]">제목</label>
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            {...register('title', { required: '제목을 입력해주세요' })}
            disabled={disabledFields.title}
            className={`w-full px-[16px] py-[14px] border rounded-[8px] text-[14px] font-medium focus:outline-none placeholder:text-[14px] placeholder:font-medium ${
              disabledFields.title
                ? 'bg-white text-[#A9A9A9] cursor-not-allowed border-[#DFE1E5]'
                : 'border-[#DFE1E5] placeholder-[#A9A9A9]'
            }`}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col items-start gap-[8px]">
          <label className="text-sm font-semibold text-[13px]">크레딧</label>
          <input
            type="number"
            placeholder="크레딧을 입력해주세요"
            {...register('credit', {
              required: '크레딧을 입력해주세요',
              min: {
                value: 0,
                message: '크레딧은 0 이상이어야 합니다.',
              },
            })}
            disabled={disabledFields.credit}
            className={`w-full px-[16px] py-[14px] border rounded-[8px] text-[14px] font-medium focus:outline-none placeholder:text-[14px] placeholder:font-medium ${
              disabledFields.credit
                ? 'bg-white text-[#A9A9A9] cursor-not-allowed border-[#DFE1E5]'
                : 'border-[#DFE1E5] placeholder-[#A9A9A9]'
            }`}
          />
          {errors.credit && (
            <p className="text-sm text-red-500 mt-1">{errors.credit.message}</p>
          )}
        </div>

        <div className="flex flex-col items-start gap-[8px]">
          <label className="text-sm font-semibold text-[13px]">내용</label>
          <textarea
            placeholder="질문하고 싶은 내용을 작성해주세요"
            {...register('content', {
              required: '내용을 입력해주세요.',
            })}
            disabled={disabledFields.content}
            onInput={handleInputResize} // 입력 시 높이 조정
            className={`w-full px-[16px] py-[14px] border rounded-[8px] resize-none overflow-hidden text-[14px] font-medium focus:outline-none placeholder:text-[14px] placeholder:font-medium ${
              disabledFields.content
                ? 'bg-white text-[#A9A9A9] cursor-not-allowed border-[#DFE1E5]'
                : 'border-[#DFE1E5] placeholder-[#A9A9A9]'
            }`}
            style={{ height: 'auto', minHeight: '156px' }} // 초기 높이 설정
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-[8px]">
          <label className="text-sm font-semibold text-[13px]">기한</label>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="yyyy/mm/dd"
              value={
                selectedDate ? format(new Date(selectedDate), 'yyyy/MM/dd') : ''
              }
              readOnly
              onClick={toggleCalendar}
              className="w-full px-[16px] py-[14px] border border-[#DFE1E5] rounded-[8px] placeholder:text-[14px] placeholder:font-medium placeholder-[#A9A9A9] focus:outline-none pr-[40px]"
            />
            <CalendarIcon />
          </div>

          {/* 모달 */}
          {isCalendarOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="w-[335px] bg-white rounded-[16px] p-5 shadow-lg">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[16px] font-semibold text-[#757575]">
                    답변 받을 기한을 설정해주세요!
                  </h2>
                  <button
                    type="button"
                    className="text-[#797C80] text-[18px] font-bold"
                    onClick={handleCancel}
                  >
                    ✕
                  </button>
                </div>

                {/* 캘린더 */}
                <div className="mb-4">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={{ before: new Date() }}
                    className="text-[#333] font-medium"
                    modifiersClassNames={{
                      selected: 'selected-day',
                      today: 'today-day',
                    }}
                    styles={{
                      head_cell: { color: '#A9A9A9' },
                      day_selected: {
                        backgroundColor: '#0582FF',
                        color: 'white',
                        borderRadius: '50%',
                      },
                      day_today: {
                        backgroundColor: '#EBF5FF',
                        color: '#0582FF',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                      },
                    }}
                  />
                </div>

                {/* 하단 버튼 */}
                <div className="flex justify-between mt-4 gap-[8px]">
                  <button
                    type="button"
                    className="w-[72px] h-[48px] px-[12px] py-[6px] border border-[#DFE1E5] rounded-[12px] text-[#333] text-[14px] font-semibold"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="flex-1 h-[48px] px-[12px] py-[6px] bg-[#0582FF] rounded-[12px] text-white text-[14px] font-semibold"
                    onClick={handleConfirm}
                  >
                    등록하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormFields;

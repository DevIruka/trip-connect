'use client';

import React from 'react';
import TopicSelector from './_components/TopicSelector';
import FormFields from './_components/FormFields';
import LocationModal from '../../components/LocationModal';
import { useFormState } from './_hooks/useFormState';
import { SubmitHandler } from 'react-hook-form';
import { FormInputs } from './_types/form';
import { supabase } from '@/utils/supabase/supabaseClient';
import {
  convertTopicsToEnglish,
  KoreanCategory,
  topicMapping,
} from '@/utils/topics';
import { useUserStore } from '@/store/userStore';

const RequestPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    errors,
    isModalOpen,
    setValue,
    selectedLocation,
    toggleModal,
    handleLocationSelect,
    clearErrors,
  } = useFormState();

  const { user } = useUserStore(); 

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const selectedCategories = data.category as KoreanCategory[];

      // 유효성 검사
      if (
        !selectedCategories.every((cat) =>
          Object.keys(topicMapping).includes(cat),
        )
      ) {
        throw new Error('유효하지 않은 카테고리가 포함되어 있습니다.');
      }

      const selectedTopicsInEnglish =
        convertTopicsToEnglish(selectedCategories);

      const { error } = await supabase.from('request_posts').insert([
        {
          ...data,
          category: selectedTopicsInEnglish, // 영어로 저장
          country_city: selectedLocation,
          user_id: user?.id, 
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      alert('질문이 성공적으로 등록되었습니다!');
      reset();
    } catch (error) {
      console.error('오류 발생:', error);
      alert('질문 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-white flex flex-col overflow-y-auto">
        <div className="h-[56px] w-full flex justify-between items-center px-[20px] py-[10px]">
          <button
            className="w-[24px] h-[24px] text-black flex items-center justify-center"
            onClick={() => history.back()}
          >
            <span className="font-semibold">✕</span>
          </button>
          <h1 className="w-[62px] h-[22px] text-[18px] font-bold text-center flex-1">
            질문하기
          </h1>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={
              !watch('country_city') ||
              !watch('category') ||
              !watch('title') ||
              !watch('content')
            }
            className={`rounded-[6px] px-[12px] py-[6px] text-[14px] font-semibold ${
              watch('country_city') &&
              watch('category') &&
              watch('title') &&
              watch('content')
                ? 'bg-[#0582FF] text-white hover:bg-[#0079F2]'
                : 'bg-[#DFE1E5] text-[#797C80] cursor-not-allowed'
            }`}
          >
            등록
          </button>
        </div>

        <form className="p-4 space-y-[28px]">
          <div className="flex flex-col items-start gap-[8px]">
            <label className="text-sm font-bold text-[13px]">
              나라/도시 선택
            </label>
            <div className="relative w-full">
              <div className="w-full px-[16px] py-[14px] border border-[#DFE1E5] rounded-[8px] flex items-center bg-white">
                <input
                  type="text"
                  value={selectedLocation}
                  placeholder="나라/도시를 선택해 주세요"
                  readOnly
                  {...register('country_city', {
                    required: '나라/도시를 선택하세요.',
                  })}
                  className="w-full text-[14px] font-medium placeholder-[#A9A9A9] bg-transparent focus:outline-none"
                  onClick={() => {
                    clearErrors('country_city');
                    toggleModal();
                  }}
                />
                {errors.country_city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country_city.message}
                  </p>
                )}

                <div className="absolute right-[16px] top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 5 10"
                    className="w-[5px] h-[10px] text-[#797C80]"
                  >
                    <path
                      d="M1 1L4 5L1 9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-[8px]">
            <label className="text-sm font-bold text-[13px]">주제 선택</label>
            <TopicSelector
              topics={[
                '맛집',
                '쇼핑',
                '숙소',
                '이벤트',
                '일정/경비',
                '문화',
                '역사',
                '액티비티',
                '기타',
              ]}
              setValue={setValue}
              watch={watch}
            />
            <input
              type="hidden"
              {...register('category', {
                validate: (value) =>
                  value?.length > 0 ? true : '최소 하나의 주제를 선택하세요.',
              })}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <FormFields
            register={register}
            watch={watch}
            control={control}
            errors={errors}
            setValue={setValue}
          />

          <LocationModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            handleLocationSelect={(location) => {
              handleLocationSelect(location); // 기존 로직 수행
              setValue('country_city', location); // react-hook-form에 선택된 값 설정
              clearErrors('country_city'); // 에러 메시지 제거
            }}
          />
        </form>
      </div>
    </>
  );
};

export default RequestPage;

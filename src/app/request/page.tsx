'use client';

import React from 'react';
import TopicSelector from './_components/TopicSelector';
import FormFields from './_components/FormFields';
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
import IconInfoCircle from './_components/icons/InfoCircle';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useModal } from '@/providers/ModalProvider';
import { getGPTTranslator } from '../post/_hooks/getGPTTranslator';

const RequestPage: React.FC = () => {
  const { t } = useTranslation('request');
  const {
    register,
    handleSubmit,
    watch,
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
  const { openModal, closeModal } = useModal();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      const selectedCategories = data.category as KoreanCategory[];
      const response = await getGPTTranslator(
        `${data.title}`,
        selectedLocation.country,
      );
      const contentResponse = await getGPTTranslator(
        `${data.content}`,
        selectedLocation.country,
      );

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

      const { data: insertData, error } = await supabase
        .from('request_posts')
        .insert([
          {
            ...data,
            category: selectedTopicsInEnglish, // 영어로 저장
            country_city: selectedLocation,
            user_id: user.id,
            translated_title: JSON.parse(
              response?.choices[0]?.message?.content ?? '{}',
            ).translated,
            translated_content: JSON.parse(
              contentResponse?.choices[0]?.message?.content ?? '{}',
            ).translated,
          },
        ])
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!insertData) {
        throw new Error('데이터 삽입 후 반환된 데이터가 없습니다.');
      }

      const postId = insertData.id;
      alert('질문이 성공적으로 등록되었습니다!');
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error('오류 발생:', error);
      alert('질문 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-white flex flex-col overflow-y-auto menuscrollbar max-w-[800px]">
        <div className="top-0 h-[56px] w-full flex justify-between items-center px-[20px] py-[10px] relative sticky z-[50] bg-white md:px-0">
          <button
            className="w-[24px] h-[24px] text-black flex items-center justify-center"
            onClick={() => history.back()}
          >
            <span className="font-semibold md:hidden">✕</span>
          </button>
          <h1 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0">
            {t('pageTitle')}
          </h1>
          <div className="md:hidden">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={
                !watch('country_city') ||
                !watch('category') ||
                !watch('title') ||
                !watch('content') ||
                !watch('date_end')
              } //getValue로 변환
              className={`rounded-[6px] px-[12px] py-[6px] text-[14px] font-semibold ${
                watch('country_city') &&
                watch('category') &&
                watch('title') &&
                watch('content') &&
                watch('date_end')
                  ? 'bg-[#0582FF] text-white hover:bg-[#0079F2]'
                  : 'bg-[#DFE1E5] text-[#797C80] cursor-not-allowed'
              }`}
            >
              {t('submitButton')}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-[4px] text-[#80BFFF] text-[14px] font-semibold px-[15px] pt-[12px] md:px-0 md:pb-[20px]">
          <IconInfoCircle />
          <span>{t('restrictedMessage')}</span>
        </div>

        <form className="p-4 space-y-[28px] md:px-[30px] md:py-[36px] md:border-[#DFE1E5] md:border md:rounded-[24px]">
          <div className="flex flex-col items-start gap-[8px] md:gap-[12px]">
            <label className="text-sm font-semibold ">
              {t('countryCityLabel')}
            </label>
            <div className="relative w-full">
              <div className="w-full px-[16px] py-[14px] border border-[#DFE1E5] rounded-[8px] flex items-center bg-white">
                <input
                  type="text"
                  value={
                    selectedLocation.country
                      ? `${selectedLocation.country}, ${selectedLocation.city}`
                      : ''
                  }
                  placeholder={t('countryCityPlaceholder')}
                  readOnly
                  {...register('country_city', {
                    required: t('countryCityError'),
                  })}
                  className="w-full text-[14px] font-medium placeholder-[#A9A9A9] bg-transparent focus:outline-none"
                  onClick={() => {
                    clearErrors('country_city');

                    if (!isModalOpen) {
                      openModal('locationModal', {
                        setCountry: (location) => {
                          handleLocationSelect(location!); // 기존 로직 수행
                          setValue('country_city', location!.country); // react-hook-form에 선택된 값 설정
                          clearErrors('country_city'); // 에러 메시지 제거
                        },
                      });
                    } else closeModal('locationModal');
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

          <div className="flex flex-col items-start gap-[8px] md:gap-[12px]">
            <label className="text-sm font-semibold ">{t('topicLabel')}</label>
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
              isSingleSelect={true}
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
            disabledFields={{
              title: false,
              credit: false,
              content: false,
              date_end: false,
            }}
          />
        </form>

        <div className="hidden md:flex justify-end pt-[28px] pb-[50px]">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={
              !watch('country_city') ||
              !watch('category') ||
              !watch('title') ||
              !watch('content') ||
              !watch('date_end')
            } //getValue로 변환
            className={`w-[168px] rounded-[12px] px-[12px] py-[6px] text-lg font-bold h-[64px] ${
              watch('country_city') &&
              watch('category') &&
              watch('title') &&
              watch('content') &&
              watch('date_end')
                ? 'bg-[#0582FF] text-white hover:bg-[#0079F2]'
                : 'bg-[#DFE1E5] text-[#797C80] cursor-not-allowed'
            }`}
          >
            {t('submitButton')}
          </button>
        </div>
      </div>
    </>
  );
};

export default RequestPage;

'use client';

import React from 'react';
import TopicSelector from './_components/TopicSelector';
import FormFields from './_components/FormFields';
import LocationModal from './_components/LocationModal';
import { useFormState } from './_hooks/useFormState';
import { SubmitHandler } from 'react-hook-form';
import { FormInputs } from './_types/form';
import { supabase } from '@/utils/supabase/supabaseClient';
import { FaSearch } from 'react-icons/fa';
import { convertTopicsToEnglish } from '@/utils/topics';

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
  } = useFormState();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const selectedTopicsInEnglish = convertTopicsToEnglish(
        data.category || [],
      );

      const { error } = await supabase.from('request_posts').insert([
        {
          ...data,
          category: selectedTopicsInEnglish, // 영어로 저장
          country_city: selectedLocation,
          user_id: '0fdbd37c-1b2e-4142-b50b-e593f13487a7', // 로그인 연동하면 수정해야함
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
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <button
          className="text-lg font-bold text-gray-800"
          onClick={() => history.back()}
        >
          ✕
        </button>
        <h1 className="text-lg font-bold">질문하기</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-black text-white py-1 px-4 rounded hover:bg-gray-800"
        >
          등록
        </button>
      </div>

      <form className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">나라/도시 선택</label>
          <div className="relative">
            <input
              type="text"
              value={selectedLocation}
              placeholder="나라/도시를 선택하세요"
              readOnly
              {...register('country_city', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none pr-10"
              onClick={toggleModal}
            />
            <FaSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18} // 아이콘 크기
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">주제 선택</label>
          <TopicSelector
            topics={['맛집', '쇼핑', '숙소', '이벤트']}
            additionalTopics={['일정/경비', '문화', '역사', '액티비티', '기타']}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <FormFields
          register={register}
          watch={watch}
          control={control}
          errors={errors}
        />

        <LocationModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          handleLocationSelect={handleLocationSelect}
        />
      </form>
    </>
  );
};

export default RequestPage;

'use client';

import React from 'react';
import TopicSelector from './_components/TopicSelector';
import FormFields from './_components/FormFields';
import LocationModal from './_components/LocationModal';
import { useFormState } from './_hooks/useFormState';
import { SubmitHandler } from 'react-hook-form';
import { FormInputs } from './_types/form';
import { supabase } from '@/utils/supabase/supabaseClient';

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
      const { error } = await supabase.from('request_posts').insert([
        {
          ...data,
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
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">나라/도시 선택</label>
          <div className="relative">
            <input
              type="text"
              value={selectedLocation}
              placeholder="나라/도시를 선택하세요"
              readOnly
              {...register('country_city', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              onClick={toggleModal}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">주제 선택</label>
          <TopicSelector
            topics={['맛집', '관광', '이벤트', '쇼핑', '숙소']}
            additionalTopics={['문화', '역사', '액티비티', '기타']}
            register={register}
            setValue={setValue}
          />
        </div>

        <FormFields
          register={register}
          watch={watch}
          control={control}
          errors={errors}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          등록하기
        </button>

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

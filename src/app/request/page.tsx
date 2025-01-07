'use client';

import React from 'react';
import TopicSelector from './_components/TopicSelector';
import FormFields from './_components/FormFields';
import LocationModal from './_components/LocationModal';
import { useFormState } from './_hooks/useFormState';
import { SubmitHandler } from 'react-hook-form';
import { FormInputs } from './_types/form';

const RequestPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    isModalOpen,
    selectedLocation,
    toggleModal,
    handleLocationSelect,
  } = useFormState();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('Form Data:', data);
    alert('질문이 등록되었습니다!');
    reset();
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
              {...register('location', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              onClick={toggleModal}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">주제 선택</label>
          <TopicSelector
            topics={['맛집', '관광', '이벤트', '쇼핑']}
            additionalTopics={['문화', '역사', '액티비티', '기타']}
            register={register}
          />
        </div>

        <FormFields register={register} watch={watch} />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          등록하기
        </button>
      </form>

      <LocationModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        handleLocationSelect={handleLocationSelect}
      />
    </>
  );
};

export default RequestPage;

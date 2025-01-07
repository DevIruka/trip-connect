'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TopicSelector from './_components/TopicSelector';
import FormFields from './_components/FormFields';
import LocationModal from './_components/LocationModal';


const QuestionFormPage: React.FC = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    alert('질문이 등록되었습니다!');
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* 나라/도시 선택 */}
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

        {/* 주제 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">주제 선택</label>
          <TopicSelector topics={['맛집', '관광', '이벤트', '쇼핑', '더보기']} register={register} />
        </div>

        {/* 폼 필드 */}
        <FormFields register={register} watch={watch} />

        {/* 등록 버튼 */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          등록하기
        </button>
      </form>

      {/* 모달 */}
      <LocationModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        handleLocationSelect={handleLocationSelect}
      />
    </>
  );
};

export default QuestionFormPage;

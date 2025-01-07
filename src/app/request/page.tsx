'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormInputs = {
  location: string;
  topic: string;
  title: string;
  credit: number;
  content: string;
  deadline: string;
};

// 도시 더미미 데이터
const continents: { name: string; cities: string[] }[] = [
  { name: '아시아', cities: ['서울', '도쿄', '방콕', '싱가포르'] },
  { name: '유럽', cities: ['런던', '파리', '로마', '베를린'] },
  { name: '북미', cities: ['뉴욕', '로스앤젤레스', '토론토', '시애틀틀'] },
  { name: '오세아니아', cities: ['시드니', '멜버른', '오클랜드'] },
  { name: '기타', cities: ['두바이', '이스탄불', '모스크바'] },
];

const QuestionForm: React.FC = () => {
  const { register, handleSubmit, watch, reset } = useForm<FormInputs>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log('Form Data:', data);
    alert('질문이 등록되었습니다!');
    reset(); // 폼 초기화
  };

  //이거 나중에 모달 스토어 만들어서 공유해야 할 거 같음
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">나라/도시 선택</label>
          <div className="relative">
            <input
              type="text"
              placeholder="나라/도시를 선택하세요"
              {...register('location', { required: true })}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              onClick={toggleModal}
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-gray-500"
              onClick={toggleModal}
            >
              🔍
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">주제 선택</label>
          <div className="flex gap-2">
            {['맛집', '관광', '이벤트', '쇼핑', '더보기'].map((topic) => (
              <button
                type="button"
                key={topic}
                className="px-3 py-2 border rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
                {...register('topic')}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

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
          <input
            type="date"
            {...register('deadline', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          등록하기
        </button>
      </form>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4">나라/도시 선택</h2>
            <div className="space-y-4">
              {continents.map(({ name, cities }) => (
                <div key={name}>
                  <h3 className="font-semibold text-gray-700 mb-2">{name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cities.map((city) => (
                      <button
                        key={city}
                        className="px-3 py-2 border rounded text-gray-600 bg-gray-100 hover:bg-gray-200"
                        onClick={() => handleLocationSelect(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
              onClick={toggleModal}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionForm;

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase/supabaseClient';
import { FormInputs } from '../../request/_types/form';
import FormFields from '../../request/_components/FormFields';
import LocationModal from '../../../components/LocationModal';
import TopicSelector from '../../request/_components/TopicSelector';
import { FaSearch } from 'react-icons/fa';
import {
  convertTopicsToEnglish,
  convertTopicsToKorean,
  EnglishCategory,
  KoreanCategory,
  topicMapping,
} from '@/utils/topics';

const EditRequestPage: React.FC = () => {
  const { request_id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormInputs>();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<string>('');
  const [isRestricted, setIsRestricted] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
    setValue('country_city', location);
    clearErrors('country_city');
  };

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        if (!request_id || typeof request_id !== 'string') {
          throw new Error('유효하지 않은 요청 ID입니다.');
        }

        const { data: requestData, error: requestError } = await supabase
          .from('request_posts')
          .select('*')
          .eq('id', request_id)
          .single();

        if (requestError || !requestData) {
          throw new Error('요청 데이터를 불러오는 데 실패했습니다.');
        }

        const categories = (requestData.category || []) as string[];
        const validCategories = categories.filter(
          (cat): cat is EnglishCategory =>
            Object.values(topicMapping).includes(cat as EnglishCategory),
        );

        const koreanCategories = convertTopicsToKorean(validCategories);

        reset({
          title: requestData.title,
          credit: requestData.credit,
          content: requestData.content,
          date_end: requestData.date_end
            ? new Date(requestData.date_end)
            : undefined,
          category: koreanCategories,
          country_city: requestData.country_city,
        });
        setSelectedLocation(requestData.country_city);

        const { data: responseData, error: responseError } = await supabase
          .from('response_posts')
          .select('*')
          .eq('request_id', request_id);

        if (responseError) throw responseError;

        // 답변이 있는 경우 제한
        if (responseData && responseData.length > 0) {
          setIsRestricted(true);
        }
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
        alert('데이터를 불러오는 데 문제가 발생했습니다.');
        router.push('/request'); // 실패했을때 어디로 리다이렉트를 해야할까...
      }
    };

    fetchRequestDetails();
  }, [request_id, reset, router]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (!request_id || typeof request_id !== 'string') {
        throw new Error('유효하지 않은 요청 ID입니다.');
      }

      const englishCategories = convertTopicsToEnglish(
        data.category as KoreanCategory[],
      );

      const { error } = await supabase
        .from('request_posts')
        .update({
          ...data,
          category: englishCategories,
          country_city: selectedLocation,
        })
        .eq('id', request_id);

      if (error) throw error;

      alert('수정이 완료되었습니다.');
      router.push('/request');
    } catch (error) {
      console.error('수정 중 오류:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <button
          className="text-lg font-bold text-gray-800"
          onClick={() => router.back()}
        >
          ✕
        </button>
        <h1 className="text-lg font-bold">질문하기</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-black text-white py-1 px-4 rounded hover:bg-gray-800"
        >
          수정
        </button>
      </div>

      <form className="p-4">
        {isRestricted && (
          <div className="text-[#80BFFF] text-[14px] font-semibold mb-2">
            답변이 달린 질문은 기한 수정만 가능해요
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">나라/도시 선택</label>
          <div className="relative">
            <input
              type="text"
              value={selectedLocation}
              placeholder="나라/도시를 선택하세요"
              readOnly
              {...register('country_city', {
                required: '나라/도시를 선택하세요.',
              })}
              className={`w-full px-3 py-2 border ${
                errors.country_city ? 'border-red-500' : 'border-gray-300'
              }   rounded focus:outline-none text-[#797C80] cursor-not-allowed`}
            />
            {errors.country_city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country_city.message}
              </p>
            )}
            <FaSearch
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              style={{ color: 'black' }}
              size={18}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">주제 선택</label>
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
            disabled={true}
            selectedCategories={watch('category')}
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
          disabledFields={{
            title: isRestricted,
            credit: isRestricted,
            content: isRestricted,
            date_end: false, // 기한 수정은 항상 가능
          }}
        />

        <LocationModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          handleLocationSelect={(location) => {
            handleLocationSelect(location);
            setValue('country_city', location);
            clearErrors('country_city');
          }}
        />
      </form>
    </>
  );
};

export default EditRequestPage;

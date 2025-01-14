'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase/supabaseClient';
import { FormInputs } from '../_types/form';
import FormFields from '../_components/FormFields';
import LocationModal from '../../../components/LocationModal';
import TopicSelector from '../_components/TopicSelector';
import { FaSearch } from 'react-icons/fa';
import { convertTopicsToEnglish, convertTopicsToKorean, EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';

const EditRequestPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState<string>('');

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
    setValue('country_city', location);
  };

  useEffect(() => {
  // 기존 데이터 불러옴옴
  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('request_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const categories = (data.category || []) as string[];
      const validCategories = categories.filter((cat): cat is EnglishCategory =>
        Object.values(topicMapping).includes(cat as EnglishCategory)
      );

      const koreanCategories = convertTopicsToKorean(validCategories) as KoreanCategory[];

      reset({
        title: data.title,
        credit: data.credit,
        content: data.content,
        date_end: data.date_end,
        category: koreanCategories,
        country_city: data.country_city,
      });
      setSelectedLocation(data.country_city);
    } catch (error) {
      console.error('데이터 불러오기 오류:', error);
      alert('데이터를 불러오는 데 문제가 발생했습니다.');
      router.push('/request'); // 실패했을때 어디로 리다이렉트를 해야할까...
    }
  };

    fetchRequestDetails();
  }, [id]);

  const onSubmit = async (data: FormInputs) => {
    try {
      const englishCategories = convertTopicsToEnglish(data.category as KoreanCategory[]);

      const { error } = await supabase
        .from('request_posts')
        .update({
          ...data,
          category: englishCategories,
          country_city: selectedLocation,
        })
        .eq('id', id);

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
        <h1 className="text-lg font-bold">질문 수정하기</h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="bg-black text-white py-1 px-4 rounded hover:bg-gray-800"
        >
          수정
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              onClick={toggleModal}
            />
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
            topics={['맛집', '쇼핑', '숙소', '이벤트','일정/경비', '문화', '역사', '액티비티', '기타']}
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

export default EditRequestPage;

'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase/supabaseClient';
import { FormInputs } from '../_types/form';
import FormFields from '../_components/FormFields';
import LocationModal from '../_components/LocationModal';
import TopicSelector from '../_components/TopicSelector';

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

  // 기존 데이터 불러옴옴
  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('request_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      reset({
        title: data.title,
        credit: data.credit,
        content: data.content,
        date_end: data.date_end,
        category: data.category,
        country_city: data.country_city,
      });
      setSelectedLocation(data.country_city);
    } catch (error) {
      console.error('데이터 불러오기 오류:', error);
      alert('데이터를 불러오는 데 문제가 발생했습니다.');
      router.push('/request'); // 실패했을때 어디로 리다이렉트를 해야할까...
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const onSubmit = async (data: FormInputs) => {
    try {
      const { error } = await supabase
        .from('request_posts')
        .update({
          ...data,
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

  const handleDelete = async () => {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('request_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('삭제가 완료되었습니다.');
      router.push('/request'); // 삭제 후 또 어디로 가야하죠 아저씨
    } catch (error) {
      console.error('삭제 중 오류:', error);
      alert('삭제 중 문제가 발생했습니다.');
    }
  };

  return (
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

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          수정하기
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>

      <LocationModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        handleLocationSelect={handleLocationSelect}
      />
    </form>
  );
};

export default EditRequestPage;

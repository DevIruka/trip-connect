'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase/supabaseClient';
import { FormInputs } from '../../request/_types/form';
import FormFields from '../../request/_components/FormFields';
import TopicSelector from '../../request/_components/TopicSelector';
import { FaSearch } from 'react-icons/fa';
import {
  convertTopicsToEnglish,
  convertTopicsToKorean,
  EnglishCategory,
  KoreanCategory,
  topicMapping,
} from '@/utils/topics';
import IconInfoCircle from '@/app/request/_components/icons/InfoCircle';
import { useTranslation } from 'react-i18next';
import { useModal } from '@/providers/ModalProvider';

type Nation = {
  continent: string;
  country: string;
  city: string;
};

const EditRequestPage: React.FC = () => {
  const { t } = useTranslation('request');
  const { request_id } = useParams();
  const router = useRouter();
  const { openModal, closeModal } = useModal();

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

  const [selectedLocation, setSelectedLocation] = useState<Nation>({
    continent: '',
    country: '',
    city: '',
  });
  const [isRestricted, setIsRestricted] = useState(false);

  const handleLocationSelect = (location: Nation | null) => {
    if (location) {
      const { continent, country, city } = location;
      setSelectedLocation({ continent, country, city });
      setValue('country_city', `${country}, ${city}`);
      clearErrors('country_city');
    } else {
      setSelectedLocation({ continent: '', country: '', city: '' });
      setValue('country_city', '');
      sessionStorage.removeItem('selectedLocation');
    }
    closeModal('locationModal');
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

        const countryCity = requestData.country_city
          ? JSON.parse(requestData.country_city)
          : { continent: '', country: '', city: '' };

        setSelectedLocation({
          continent: countryCity.continent || '',
          country: countryCity.country || '',
          city: countryCity.city || '',
        });

        reset({
          title: requestData.title,
          credit: requestData.credit,
          content: requestData.content,
          date_end: requestData.date_end
            ? new Date(requestData.date_end)
            : undefined,
          category: koreanCategories,
          country_city: `${countryCity.country}, ${countryCity.city}`,
        });

        const { data: responseData, error: responseError } = await supabase
          .from('response_posts')
          .select('id')
          .eq('request_id', request_id);

        if (responseError) throw responseError;

        // 답변이 있는 경우 제한
        setIsRestricted(responseData && responseData.length > 0);
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
        alert('데이터를 불러오는 데 문제가 발생했습니다.');
        router.push(`/post/${request_id}`);
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
          country_city: JSON.stringify(selectedLocation),
        })
        .eq('id', request_id);

      if (error) throw error;

      alert('수정이 완료되었습니다.');
      router.push(`/post/${request_id}`);
    } catch (error) {
      console.error('수정 중 오류:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col overflow-y-auto menuscrollbar max-w-[800px]">
      <div className="top-0 h-[56px] w-full flex justify-between items-center px-[20px] py-[10px] relative sticky z-[50] bg-white md:px-0">
        <button
          className="w-[24px] h-[24px] text-black flex items-center justify-center"
          onClick={() => router.back()}
        >
          <span className="font-semibold md:hidden">✕</span>
        </button>
        <h1 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0">
          {t('pageTitle')}
        </h1>
        <div className="md:hidden">
          <button
            onClick={handleSubmit(onSubmit)}
            className="h-8 px-3 py-1.5 bg-[#0582ff] rounded-md justify-center items-center gap-2.5 inline-flex text-white text-sm font-semibold"
            disabled={false}
          >
            {t('editButton')}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-[4px] text-[#80BFFF] text-[14px] font-semibold px-[15px] pt-[12px] md:px-0 md:pb-[20px]">
        {' '}
        <IconInfoCircle />
        <span>{t('restrictedMessage')}</span>
      </div>

      <div className="p-[20px_15px_31px_20px] md:border-[#DFE1E5] md:border md:rounded-[24px]">
        <div className="mb-[28px]">
          <label className="block text-sm font-semibold mb-2">
            {t('countryCityLabel')}
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={`${selectedLocation.country}, ${selectedLocation.city}`}
              readOnly
              placeholder={t('countryCityPlaceholder')}
              {...register('country_city', {
                required: t('countryCityError'),
              })}
              className={`w-full py-[14px] px-[16px] border ${
                errors.country_city ? 'border-red-500' : 'border-gray-300'
              } rounded focus:outline-none ${
                isRestricted
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : 'bg-white text-black'
              }`}
              onClick={
                !isRestricted
                  ? () =>
                      openModal('locationModal', {
                        setCountry: handleLocationSelect,
                        selectedCountry: selectedLocation,
                      })
                  : undefined
              }
            />
            {errors.country_city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country_city.message}
              </p>
            )}
            {!isRestricted && (
              <FaSearch
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{ color: 'black' }}
                size={18}
              />
            )}
          </div>
        </div>

        <div className="mb-[28px]">
          <label className="block text-sm font-semibold mb-2">
            {t('topicLabel')}
          </label>
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
            disabled={isRestricted}
            setValue={setValue}
            selectedCategories={watch('category')}
            isSingleSelect
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
      </div>

      <div className="hidden md:flex justify-end pt-[28px] pb-[50px]">
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-[168px] h-[64px] rounded-[12px] px-[12px] py-[6px] text-lg font-bold bg-[#0582FF] text-white"
          disabled={false}
        >
          {t('editButton')}
        </button>
      </div>
    </div>
  );
};

export default EditRequestPage;

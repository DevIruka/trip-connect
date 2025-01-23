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
import { LocationModal } from '@/components/LocationModalNew';
import IconInfoCircle from '@/app/request/_components/icons/InfoCircle';
import { useTranslation } from 'react-i18next';

type nation = {
  continent: string;
  country: string;
  city: string;
};

const EditRequestPage: React.FC = () => {
  const { t } = useTranslation('request');
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
  const [selectedLocation, setSelectedLocation] = useState<{
    continent: string;
    country: string;
    city: string;
  }>({ continent: '', country: '', city: '' });
  const [isRestricted, setIsRestricted] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleLocationSelect = (location: nation | null) => {
    if (location) {
      const { continent, country, city } = location;
      setSelectedLocation({ continent, country, city });
      setValue('country_city', `${country}, ${city}`);
      clearErrors('country_city');
      sessionStorage.setItem(
        'selectedLocation',
        JSON.stringify({ continent, country, city }),
      ); // 선택된 값 저장
    } else {
      setSelectedLocation({ continent: '', country: '', city: '' });
      setValue('country_city', '');
      sessionStorage.removeItem('selectedLocation');
    }
    toggleModal();
  };

  useEffect(() => {
    const savedLocation = sessionStorage.getItem('selectedLocation');
    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      setSelectedLocation(parsedLocation);
      setValue(
        'country_city',
        `${parsedLocation.country}, ${parsedLocation.city}`,
      );
    }
  }, [setValue]);

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
    <div className="h-screen overflow-y-auto bg-white">
      <div className="flex justify-between items-center px-5 py-2 relative">
        <button className="text-lg font-bold" onClick={() => router.back()}>
          ✕
        </button>
        <h1 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
          {t('pageTitle')}
        </h1>
        <button
          onClick={handleSubmit(onSubmit)}
          className="h-8 px-3 py-1.5 bg-[#0582ff] rounded-md justify-center items-center gap-2.5 inline-flex text-white text-sm font-semibold"
          disabled={false}
        >
          {t('editButton')}
        </button>
      </div>

      <div className="flex items-center gap-[4px] text-[#80BFFF] text-[14px] font-semibold px-[15px] pt-[12px]">
        <IconInfoCircle />
        <span>{t('restrictedMessage')}</span>
      </div>

      <div className="p-[20px_15px_31px_20px]">
        <div className="mb-[28px]">
          <label className="block text-sm font-semibold mb-2">
            {t('countryCityLabel')}
          </label>
          <div className="relative">
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
              onClick={!isRestricted ? toggleModal : undefined}
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
          <label className="block text-sm font-medium mb-2">{t('topicLabel')}</label>
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

        <LocationModal
          isOpen={isModalOpen}
          onClose={() => {
            toggleModal();
          }}
          setCountry={(location) => {
            handleLocationSelect(location);
            toggleModal();
          }}
          selectedCountry={selectedLocation}
        />
      </div>
    </div>
  );
};

export default EditRequestPage;

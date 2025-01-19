'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormInputs } from '../_types/form';
import { nation } from '@/app/home/_types/homeTypes';

export const useFormState = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<nation>({
    continent: '',
    country: '',
    city: '',
  });

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleLocationSelect = (location: nation) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  return {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    errors,
    setValue,
    clearErrors,
    isModalOpen,
    selectedLocation,
    toggleModal,
    handleLocationSelect,
  };
};

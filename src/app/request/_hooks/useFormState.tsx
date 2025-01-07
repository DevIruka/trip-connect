'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormInputs } from '../_types/form';

export const useFormState = () => {
  const { register, handleSubmit, watch, reset } = useForm<FormInputs>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsModalOpen(false);
  };

  return {
    register,
    handleSubmit,
    watch,
    reset,
    isModalOpen,
    selectedLocation,
    toggleModal,
    handleLocationSelect,
  };
};

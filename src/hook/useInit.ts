'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import i18n from '@/app/i18n'; 

const useInit = () => {
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ko' | 'en' | null;
    const initialLanguage = storedLanguage || 'ko'; 
    setLanguage(initialLanguage); 
    i18n.changeLanguage(initialLanguage);
  }, [setLanguage]);
};

export default useInit;


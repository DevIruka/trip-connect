'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './common.json';
import en from './en.json';
import ko from './ko.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...common, ...en } },
    ko: { translation: { ...common, ...ko } },
  },
  lng: 'ko', 
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

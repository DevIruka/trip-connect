'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'ko' : 'ko';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(HttpApi) // JSON 파일 로드
    .init({
      lng: savedLang,
      supportedLngs: ['en', 'ko'],
      interpolation: { escapeValue: false },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // 'login.json'을 정확히 요청하게 설정
      },
    });
}

export default i18n;

'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

const getLanguageFromCookie = (): 'ko' | 'en' => {
  if (typeof window !== 'undefined') {
    console.log('확인')
    const match = document.cookie.match(/lang=([^;]+)/);
    return match && match[1] === 'en' ? 'en' : 'ko'; // 'en'이면 'en', 아니면 'ko'
  }
  return 'ko'; // 서버 사이드에서는 기본값 'ko' 반환
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(HttpApi) // JSON 파일 로드
    .init({
      lng: getLanguageFromCookie(),
      supportedLngs: ['en', 'ko'],
      interpolation: { escapeValue: false },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // 'login.json'을 정확히 요청하게 설정
      },
    });
}

export default i18n;

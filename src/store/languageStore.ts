// import { create } from 'zustand';
// import i18n from '@/app/i18n';
import { persist } from 'zustand/middleware';
// type LanguageState = {
//   language: 'ko' | 'en';
//   setLanguage: (lng: 'ko' | 'en') => void;
// };

import { create } from 'zustand';

// export const useLanguageStore = create<LanguageState>()(
//   persist(
//     (set) => ({
//       language: 'ko',
//       setLanguage: (lng) => {
//         localStorage.setItem('language', lng);
//         i18n.changeLanguage(lng);
//         set({ language: lng });
//       },
//     }),
//     {
//       name: 'language',
//     },
//   ),
// );

// zustand/store.js

type LangState = {
  lang: 'en' | 'ko';
  setLang: (newLang: 'en' | 'ko') => void;
};

export const useLang = create<LangState>()(
    persist(
      (set) => ({
        lang: 'ko', // 기본값 (로컬 스토리지에 값이 없을 경우 사용됨)
        setLang: (newLang) => set({ lang: newLang }),
      }),
      {
        name: 'lang', // localStorage에 저장될 키
      }
    )
  );

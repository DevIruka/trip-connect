// import { create } from 'zustand';
// import i18n from '@/app/i18n';
// import { persist } from 'zustand/middleware';
// type LanguageState = {
//   language: 'ko' | 'en';
//   setLanguage: (lng: 'ko' | 'en') => void;
// };

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

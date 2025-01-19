// import { useRouter } from 'next/navigation';
// import { useTranslation } from 'react-i18next';
// import { useLanguageStore } from '@/store/languageStore';

// const LanguageSettings = () => {
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { language, setLanguage } = useLanguageStore();

//   const handleLanguageChange = (lng: 'ko' | 'en') => {
//     setLanguage(lng);
//     router.refresh();
//   };

//   return (
//     <div className="px-5">
//       <button
//         className="text-black text-lg font-medium mb-4"
//         onClick={() => router.back()}
//       >
//         ←
//       </button>
//       <h1 className="text-black text-xl font-semibold mb-6">
//         {t('languageSettings')} {/* 번역된 텍스트 */}
//       </h1>
//       <div className="space-y-4">
//         <div
//           className={`flex items-center justify-between p-4 rounded-lg border ${
//             language === 'ko' ? 'border-black' : 'border-gray-300'
//           }`}
//           onClick={() => handleLanguageChange('ko')}
//         >
//           <span className="text-black">한국어</span>
//           {language === 'ko' && <span>✔</span>}
//         </div>
//         <div
//           className={`flex items-center justify-between p-4 rounded-lg border ${
//             language === 'en' ? 'border-black' : 'border-gray-300'
//           }`}
//           onClick={() => handleLanguageChange('en')}
//         >
//           <span className="text-black">English</span>
//           {language === 'en' && <span>✔</span>}
//         </div>
//       </div>
//       <p className="mt-6 text-gray-500 text-sm">
//         {t('otherLanguagesComingSoon')}
//       </p>
//     </div>
//   );
// };

// export default LanguageSettings;

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

const LanguagePage = () => {
  return (
    <div>LanguagePage</div>
  )
}
export default LanguagePage

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

'use client';

import { useLang } from '@/store/languageStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
const lefticon = '/images/ic-left.svg';

const LanguagePage = () => {
  const { lang, setLang } = useLang();
  const [selectedLang, setSelectedLang] = useState<'ko' | 'en'>(lang); // 변경할 언어 상태 추가
  const { i18n } = useTranslation();
  const router = useRouter();

  const handleLanguageSelect = (language: 'ko' | 'en') => {
    setSelectedLang(language); // 선택만 변경, 즉시 반영 X
  };

  const handleSave = () => {
    setLang(selectedLang); // Zustand 상태 업데이트
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `lang=${selectedLang}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
    i18n.changeLanguage(selectedLang); // i18next 적용
    router.refresh();
  };

  return (
    <div className="min-h-screen px-5 py-4 bg-white">
      {/* 헤더 섹션 */}
      <div
        className="flex flex-row justify-between items-center"
        style={{
          height: '56px',
          padding: '10px 20px',
        }}
      >
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
      </div>

      <div
        className="flex items-center"
        style={{
          height: '48px',
          padding: '8px 20px',
        }}
      >
        <h2
          className="text-[20px] font-[700] text-[#45484D]"
          style={{
            textAlign: 'left',
            lineHeight: '32px',
            letterSpacing: '-0.4px',
            fontFamily: 'Pretendard',
          }}
        >
          언어설정
        </h2>
      </div>

      {/* 언어 선택 */}
      <div className="w-full max-w-[335px]">
        {/* 한국어 */}
        <div
          className={`flex items-center gap-[55px] border-b cursor-pointer ${
            selectedLang === 'ko' ? 'text-black font-bold' : 'text-gray-500'
          }`}
          onClick={() => handleLanguageSelect('ko')}
          style={{
            display: 'flex',
            padding: '16px 16px 0px 16px',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderBottom: '1px solid var(--Grayscale-Gray-7-line, #EBEBEB)',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              lineHeight: '160%',
              letterSpacing: '-0.32px',
            }}
          >
            한국어
          </span>
          {selectedLang === 'ko' && (
            <span
              style={{
                color: 'var(--Primary-Blue, #0582FF)',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              ✔
            </span>
          )}
        </div>

        {/* 영어 */}
        <div
          className={`flex items-center gap-[55px] border-b cursor-pointer ${
            selectedLang === 'en' ? 'text-black font-bold' : 'text-gray-500'
          }`}
          onClick={() => handleLanguageSelect('en')}
          style={{
            display: 'flex',
            padding: '16px',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderBottom: '1px solid var(--Grayscale-Gray-7-line, #EBEBEB)',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              lineHeight: '160%',
              letterSpacing: '-0.32px',
            }}
          >
            English
          </span>
          {selectedLang === 'en' && (
            <span
              style={{
                color: 'var(--Primary-Blue, #0582FF)',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              ✔
            </span>
          )}
        </div>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        다른 언어들은 나중에 추가될 예정이에요.
      </p>
      {/* 완료 버튼 */}
      <a
        href="/"
        onClick={handleSave}
        className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg"
      >
        완료
      </a>
    </div>
  );
};

export default LanguagePage;

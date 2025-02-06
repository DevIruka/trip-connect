'use client';

import { useLang } from '@/store/languageStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
const lefticon = '/images/ic-left.svg';
const checkBlue = '/images/ic-select.svg';
const checkWhite = '/images/ic-selectb.svg';

const LanguagePage = () => {
  const { lang, setLang } = useLang();
  const [selectedLang, setSelectedLang] = useState<'ko' | 'en'>(lang);
  const { t, i18n } = useTranslation('mypage');
  const router = useRouter();

  const handleLanguageSelect = (language: 'ko' | 'en') => {
    setSelectedLang(language);
    setLang(language);
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `lang=${language}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
    i18n.changeLanguage(language);
    router.refresh();
  };

  return (
    <div className="md:min-h-[calc(100vh-84px)] h-full w-full bg-white md:flex md:w-[872px] md:px-[36px] md:py-0 md:flex-col md:items-start md:gap-[28px] px-5">
      <div className="flex flex-row items-center w-[375px] h-[56px] mt-0 py-[10px] gap-[206px] flex-shrink-0 md:hidden">
        <button
          onClick={() => router.push('/mypage')}
          className="flex items-center justify-center"
        >
          <Image src={lefticon} width={24} height={24} alt="back" />
        </button>
      </div>

      <div className="flex items-center w-[375px] px-[20px] md:mt-[40px] py-[8px] gap-[8px] md:w-[800px] md:h-[65px] md:px-[0px] md:py-[10px] md:gap-[10px] md:items-center md:self-stretch">
        <h2 className="text-[20px] md:text-[28px] font-[700] text-[#45484D] text-center font-pretendard leading-[32px] tracking-[-0.4px]">
          {t('language_settings')}
        </h2>
      </div>

      {/* 언어 선택 */}
      <div className="w-full max-w-[335px] md:max-w-[800px] md:px-[16px] mt-[24px] mx-auto bg-[##F9F9F9]">
        <div className="flex flex-col md:items-start">
          {/* 한국어 */}
          <div
            className={`flex items-center cursor-pointer justify-between text-black px-[16px] pt-[16px] pb-0 gap-[55px] self-stretch md:w-full md:h-[61px] md:px-[16px] md:py-[0px] md:gap-[55px] md:items-center md:self-stretch`}
            onClick={() => handleLanguageSelect('ko')}
          >
            <span className="text-[16px] md:text-[18px] font-pretendard font-medium leading-[160%] tracking-[-0.32px]">
              {t('korean')}
            </span>
            <Image
              src={selectedLang === 'ko' ? checkBlue : checkWhite}
              width={24}
              height={24}
              alt={selectedLang === 'ko' ? 'selected' : 'unselected'}
            />
          </div>

          <div className="flex flex-row justify-center items-center border-b w-[95%] border-[#EBEBEB] mx-auto"></div>

          {/* 영어 */}
          <div
            className={`flex items-center cursor-pointer justify-between text-black px-[16px] pt-[16px] pb-0 gap-[55px] self-stretch md:w-full md:h-[61px] md:px-[16px] md:py-[0px] md:gap-[55px] md:items-center md:self-stretch`}
            onClick={() => handleLanguageSelect('en')}
          >
            <span className="text-[16px] md:text-[18px] font-pretendard font-medium leading-[160%] tracking-[-0.32px]">
              {t('english')}
            </span>
            <Image
              src={selectedLang === 'en' ? checkBlue : checkWhite}
              width={24}
              height={24}
              alt={selectedLang === 'en' ? 'selected' : 'unselected'}
            />
          </div>

          <div className="flex flex-row justify-center items-center border-b w-[95%] border-[#EBEBEB] mx-auto"></div>

          {/* 일본어 */}
          <div className="flex items-center cursor-pointer justify-between text-gray-500 px-[16px] pt-[16px] pb-0 gap-[55px] self-stretch md:w-full md:h-[61px] md:px-[16px] md:py-[0px] md:gap-[55px] md:items-center md:self-stretch">
            <span className="text-[16px] md:text-[18px] text-black font-pretendard font-medium leading-[160%] tracking-[-0.32px]">
              {t('japanese')}
            </span>
            <span className="text-[14px] md:text-[16px] text-[#A9A9A9] font-pretendard">
              {t('coming_soon')}
            </span>
          </div>

          <div className="flex flex-row justify-center items-center border-b w-[95%] border-[#EBEBEB] mx-auto"></div>

          {/* 중국어 */}
          <div className="flex items-center cursor-pointer justify-between text-gray-500 px-[16px] pt-[16px] pb-0 gap-[55px] self-stretch md:w-full md:h-[61px] md:px-[16px] md:py-[0px] md:gap-[55px] md:items-center md:self-stretch">
            <span className="text-[16px] md:text-[18px] text-black font-pretendard font-medium leading-[160%] tracking-[-0.32px]">
              {t('chinese')}
            </span>
            <span className="text-[14px] md:text-[16px] text-[#A9A9A9] font-pretendard">
              {t('coming_soon')}
            </span>
          </div>
        </div>

        <p className="mt-[17px] text-[#808080] text-[12px] px-[16px] md:text-[14px] md:mt-[13px] font-pretendard font-medium tracking-[-0.24px]">
          {t('more_languages_coming')}
        </p>
      </div>
    </div>
  );
};

export default LanguagePage;

// 'use client';

// import { useLang } from '@/store/languageStore';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// import { useTranslation } from 'react-i18next';
// const lefticon = '/images/ic-left.svg';

// const LanguagePage = () => {
//   const { lang, setLang } = useLang();
//   const [selectedLang, setSelectedLang] = useState<'ko' | 'en'>(lang); // 변경할 언어 상태 추가
//   const { t, i18n } = useTranslation('mypage'); // i18n 번역 추가
//   const router = useRouter();

//   const handleLanguageSelect = (language: 'ko' | 'en') => {
//     setSelectedLang(language); // 선택만 변경, 즉시 반영 X
//   };

//   const handleSave = () => {
//     setLang(selectedLang); // Zustand 상태 업데이트
//     const expires = new Date();
//     expires.setFullYear(expires.getFullYear() + 1);
//     document.cookie = `lang=${selectedLang}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
//     i18n.changeLanguage(selectedLang); // i18next 적용
//     router.refresh();
//   };

//   return (
//     <div className="min-h-screen px-5 py-4 bg-white">
//       {/* 헤더 섹션 */}
//       <div
//         className="flex flex-row justify-between items-center"
//         style={{
//           height: '56px',
//           padding: '10px 20px',
//         }}
//       >
//         <button
//           onClick={() => router.push('/mypage')}
//           className="flex items-center justify-center"
//         >
//           <Image src={lefticon} width={24} height={24} alt="back" />
//         </button>
//       </div>

//       <div
//         className="flex items-center"
//         style={{
//           height: '48px',
//           padding: '8px 20px',
//         }}
//       >
//         <h2
//           className="text-[20px] font-[700] text-[#45484D]"
//           style={{
//             textAlign: 'left',
//             lineHeight: '32px',
//             letterSpacing: '-0.4px',
//             fontFamily: 'Pretendard',
//           }}
//         >
//           {t('language_settings')}
//         </h2>
//       </div>

//       {/* 언어 선택 */}
//       <div className="w-full max-w-[335px]">
//         <div className="flex flex-col">
//           {/* 한국어 */}
//           <div
//             className={`flex items-center cursor-pointer justify-between ${
//               selectedLang === 'ko' ? 'text-black font-bold' : 'text-gray-500'
//             }`}
//             onClick={() => handleLanguageSelect('ko')}
//             style={{
//               display: 'flex',
//               padding: '16px',
//               alignItems: 'center',
//               alignSelf: 'stretch',
//             }}
//           >
//             <span
//               style={{
//                 fontSize: '16px',
//                 fontFamily: 'Pretendard',
//                 fontWeight: 500,
//                 lineHeight: '160%',
//                 letterSpacing: '-0.32px',
//               }}
//             >
//               {t('korean')}
//             </span>
//             {selectedLang === 'ko' && (
//               <span
//                 style={{
//                   color: 'var(--Primary-Blue, #0582FF)',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 ✔
//               </span>
//             )}
//           </div>

//           {/* 영어 */}
//           <div
//             className={`flex items-center cursor-pointer justify-between ${
//               selectedLang === 'en' ? 'text-black font-bold' : 'text-gray-500'
//             }`}
//             onClick={() => handleLanguageSelect('en')}
//             style={{
//               display: 'flex',
//               padding: '16px',
//               alignItems: 'center',
//               alignSelf: 'stretch',
//             }}
//           >
//             <span
//               style={{
//                 fontSize: '16px',
//                 fontFamily: 'Pretendard',
//                 fontWeight: 500,
//                 lineHeight: '160%',
//                 letterSpacing: '-0.32px',
//               }}
//             >
//               {t('english')}
//             </span>
//             {selectedLang === 'en' && (
//               <span
//                 style={{
//                   color: 'var(--Primary-Blue, #0582FF)',
//                   fontSize: '16px',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 ✔
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <p className="mt-6 text-gray-500 text-sm">{t('more_languages_coming')}</p>
//       {/* 완료 버튼 */}
//       <button
//         onClick={handleSave}
//         className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-3 px-4 rounded-lg"
//         style={{
//           fontFamily: 'Pretendard',
//           fontWeight: 600,
//           width: 'calc(100% - 40px)', // 화면 양쪽에서 20px씩 마진
//           maxWidth: '335px', // 최대 너비 설정
//         }}
//       >
//         {t('save')}
//       </button>
//     </div>
//   );
// };

// export default LanguagePage;

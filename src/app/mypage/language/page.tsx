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
        <div className="flex flex-col">
          {/* 한국어 */}
          <div
            className={`flex items-center cursor-pointer justify-between ${
              selectedLang === 'ko' ? 'text-black font-bold' : 'text-gray-500'
            }`}
            onClick={() => handleLanguageSelect('ko')}
            style={{
              display: 'flex',
              padding: '16px',
              alignItems: 'center',
              alignSelf: 'stretch',
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
            className={`flex items-center cursor-pointer justify-between ${
              selectedLang === 'en' ? 'text-black font-bold' : 'text-gray-500'
            }`}
            onClick={() => handleLanguageSelect('en')}
            style={{
              display: 'flex',
              padding: '16px',
              alignItems: 'center',
              alignSelf: 'stretch',
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
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        다른 언어들은 나중에 추가될 예정이에요.
      </p>
      {/* 완료 버튼 */}
      <button
        onClick={handleSave}
        className="fixed bottom-5 left-0 w-full bg-blue-500 text-white px-6 py-3 rounded-lg"
        style={{ fontFamily: 'Pretendard', fontWeight: 600 }}
      >
        완료
      </button>
    </div>
  );
};

export default LanguagePage;

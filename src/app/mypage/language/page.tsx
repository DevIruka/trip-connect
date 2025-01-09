'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('한국어'); // 기본값
  const router = useRouter();

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // 여기에서 언어 변경 관련 로직을 추가할 수 있습니다 (예: API 호출).
  };

  return (
    <div className="px-5">
      <button
        className="text-black text-lg font-medium mb-4"
        onClick={() => router.back()}
      >
        ←
      </button>
      <h1 className="text-black text-xl font-semibold mb-6">언어 설정</h1>
      <div className="space-y-4">
        {/* 한국어 선택 */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg border ${
            selectedLanguage === '한국어' ? 'border-black' : 'border-gray-300'
          }`}
          onClick={() => handleLanguageChange('한국어')}
        >
          <span className="text-black">한국어</span>
          {selectedLanguage === '한국어' && <span>✔</span>}
        </div>
        {/* 영어 선택 */}
        <div
          className={`flex items-center justify-between p-4 rounded-lg border ${
            selectedLanguage === 'English' ? 'border-black' : 'border-gray-300'
          }`}
          onClick={() => handleLanguageChange('English')}
        >
          <span className="text-black">English</span>
          {selectedLanguage === 'English' && <span>✔</span>}
        </div>
      </div>
      <p className="mt-6 text-gray-500 text-sm">
        다른 언어들은 나중에 추가될 예정이에요.
      </p>
    </div>
  );
};

export default LanguageSettings;

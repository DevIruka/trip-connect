'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/config/i18n';
import { useLang } from '@/store/languageStore';
import { useRouter } from 'next/navigation';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const route = useRouter();
  const { setLang } = useLang();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');
        const data = await response.json();

        if (data.countryCode !== 'KR') {
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 1);
          document.cookie = `lang=${'en'}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
          setLang('en');
          route.refresh();
        }
      } catch (error) {
        console.error('국가 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCountry();
  }, [setLang]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

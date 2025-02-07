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
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : null;
    };

    if (getCookie('lang')) return;
    const fetchCountry = async () => {
      try {
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();

        if (data.country_code !== 'KR') {
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 1);
          document.cookie = `lang=${'en'}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Strict`;
          setLang('en');
          setTimeout(() => route.refresh(), 100);
        }
      } catch (error) {
        console.error('국가 정보를 가져오는 중 오류 발생:', error);
      }
    };

    fetchCountry();
  }, [setLang]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

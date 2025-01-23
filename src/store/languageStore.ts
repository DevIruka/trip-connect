import { create } from 'zustand';

type Lang = 'en' | 'ko';

type LangState = {
  lang: Lang;
  setLang: (newLang: Lang) => void;
};

const getLanguageFromCookie = (): Lang => {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(/lang=([^;]+)/);
    return match && match[1] === 'en' ? 'en' : 'ko'; // 'en'이면 'en', 아니면 'ko'
  }
  return 'ko'; // 서버 사이드에서는 기본값 'ko' 반환
};

export const useLang = create<LangState>((set) => ({
  lang: getLanguageFromCookie(), // 기본값 (쿠키에서 값을 가져옴)
  setLang: (newLang) => set({ lang: newLang }),
}));

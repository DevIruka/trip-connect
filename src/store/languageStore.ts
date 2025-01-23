import { create } from 'zustand';

type Lang = 'en' | 'ko'

type LangState = {
  lang: 'en' | 'ko';
  setLang: (newLang: Lang) => void;
};

type getLanguageFromCookie = () => Lang;

const getLanguageFromCookie = () => {
    const match = document.cookie.match(/lang=([^;]+)/);
    return match && match[1] === 'en' ? 'en' : 'ko'; // 'en'이면 'en', 아니면 'ko'
  };

export const useLang = create<LangState>()((set) => ({
  lang: getLanguageFromCookie(), // 기본값 (로컬 스토리지에 값이 없을 경우 사용됨)
  setLang: (newLang) => set({ lang: newLang }),
}));

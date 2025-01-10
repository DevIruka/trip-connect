import { create } from 'zustand';

interface SearchState {
  keyword: string;
  setKeyword: (by: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  setKeyword: (newKeyword: string) => set(() => ({ keyword: newKeyword })),
}));

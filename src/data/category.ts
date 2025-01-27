import { EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';

export const category = ['All', ...Object.values(topicMapping)] as EnglishCategory[]

export const categoryMapping: Record<
  KoreanCategory | '전체',
  EnglishCategory | 'All'
> = {
  '전체': 'All',
  ...topicMapping,
};

import { EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';

export const category = ['all', ...Object.values(topicMapping)] as EnglishCategory[]

export const categoryMapping: Record<
  KoreanCategory | '전체',
  EnglishCategory | 'all'
> = {
  '전체': 'all',
  ...topicMapping,
};

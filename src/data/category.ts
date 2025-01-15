import { EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';

export const category = ['👀전체', ...Object.keys(topicMapping)];

export const categoryMapping: Record<
  KoreanCategory | '👀전체',
  EnglishCategory | 'all'
> = {
  '👀전체': 'all',
  ...topicMapping,
};

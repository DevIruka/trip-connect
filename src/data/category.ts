export type Category =
  | 'all'
  | 'food'
  | 'place'
  | 'shelter'
  | 'event'
  | 'date-price';

export const category: Category[] = [
  'all',
  'food',
  'place',
  'shelter',
  'event',
  'date-price',
];

export const categoryMapping: Record<Category, string> = {
  all: '전체',
  food: '음식',
  place: '장소',
  shelter: '숙소',
  event: '이벤트',
  'date-price': '경비',
};

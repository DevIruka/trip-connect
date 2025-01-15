// 주제 한국어-영어 매핑
export type EnglishCategory =
  | 'food'
  | 'shopping'
  | 'lodging'
  | 'event'
  | 'date-price'
  | 'schedule-expenses'
  | 'culture'
  | 'history'
  | 'activity'
  | 'etc';

export type KoreanCategory =
  | '맛집'
  | '쇼핑'
  | '숙소'
  | '이벤트'
  | '일정/경비'
  | '문화'
  | '역사'
  | '액티비티'
  | '기타';

export const topicMapping: Record<KoreanCategory, EnglishCategory> = {
  맛집: 'food',
  쇼핑: 'shopping',
  숙소: 'lodging',
  이벤트: 'event',
  '일정/경비': 'schedule-expenses',
  문화: 'culture',
  역사: 'history',
  액티비티: 'activity',
  기타: 'etc',
};

// 주제를 영어로 변환하는 유틸 함수
export const convertTopicsToEnglish = (topics: KoreanCategory[]): string[] => {
  return topics.map((topic) => topicMapping[topic] || topic);
};

// 영어에서 한국어로
export const convertTopicsToKorean = (topics: EnglishCategory[]): string[] => {
  const reverseMapping = Object.fromEntries(
    Object.entries(topicMapping).map(([kor, eng]) => [eng, kor]),
  );
  return topics.map((topic) => reverseMapping[topic] || topic);
};

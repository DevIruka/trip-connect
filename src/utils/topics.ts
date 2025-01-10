// 주제 한국어-영어 매핑
export const topicMapping: { [key: string]: string } = {
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
export const convertTopicsToEnglish = (topics: string[]): string[] => {
  return topics.map((topic) => topicMapping[topic] || topic);
};

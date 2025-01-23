import { EnglishCategory, KoreanCategory, topicMapping } from "@/utils/topics";

export const reverseTopicMapping = Object.fromEntries(
  Object.entries(topicMapping).map(([key, value]) => [value, key]),
);

export const convertToKorean = (
  english: EnglishCategory | null,
): KoreanCategory | '전체' => {
  if (!english) return '전체'; // null 또는 undefined일 경우 "전체" 반환
  return (reverseTopicMapping[english] as KoreanCategory) || '전체'; // 매핑 실패 시 "전체" 반환
};

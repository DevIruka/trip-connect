import Icon from '@/components/icons';
import { EnglishCategory, KoreanCategory, topicMapping } from '@/utils/topics';

const TabDetail = ({ category }: { category: EnglishCategory | null }) => {
  const reverseTopicMapping = Object.fromEntries(
    Object.entries(topicMapping).map(([key, value]) => [value, key]),
  );

  const convertToKorean = (english: EnglishCategory | null): KoreanCategory | "전체" => {
    if (!english) return "전체"; // null 또는 undefined일 경우 "전체" 반환
    return (reverseTopicMapping[english] as KoreanCategory) || "전체"; // 매핑 실패 시 "전체" 반환
  };

  return (
    <>
      <Icon size={20} type={category || "all"} />
      <span className="ml-[4px] text-[16px] font-[600]">{convertToKorean(category)}</span>
    </>
  );
};

export default TabDetail;
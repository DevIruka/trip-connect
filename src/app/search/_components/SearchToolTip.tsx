import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RxCross2 } from 'react-icons/rx';

const iconHelp = '/images/ic-help.svg';

type SearchToolTip = {
  handleClearRecentSearches: () => void;
  recentSearches: string[];
};

const SearchToolTip = ({
  handleClearRecentSearches,
  recentSearches,
}: SearchToolTip) => {
  const { t } = useTranslation('search');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const handleTooltipToggle = () => {
    setIsTooltipVisible(!isTooltipVisible); // 클릭 시 메시지 박스 표시/숨기기
  };
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row">
          <p className="text-[16px] font-[600]">{t('recentSearch')}</p>
          <Image
            src={iconHelp}
            alt="Help icon"
            width={16}
            height={16}
            className="ml-[3px] md:ml-[10px] cursor-pointer"
            onClick={handleTooltipToggle}
          />
        </div>
        <div>
          {recentSearches.length > 0 && (
            <button onClick={handleClearRecentSearches}>
              <span className="text-[12px] text-[#45484D] tracking-[-0.24px] underline underline-offset-[1px]">
              {t('deleteall')}
              </span>
            </button>
          )}
        </div>
      </div>
      {isTooltipVisible && (
        <div className="absolute top-8 right-[120px] w-[224px]">
          <div className="flex flex-row items-center relative max-w-md py-[8px] pl-[12px] pr-[12px] bg-[#3A474E] rounded-md shadow-md">
            <p className="text-[12px] text-white pr-[4px] font-[500] tracking-[-0.24px]">
              {t('limit')}
            </p>
            <RxCross2
              size={18}
              onClick={handleTooltipToggle}
              className="cursor-pointer"
              style={{ color: 'white' }}
            />
            <div className="absolute -top-2 left-[81px] w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-[#3A474E]"></div>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchToolTip;

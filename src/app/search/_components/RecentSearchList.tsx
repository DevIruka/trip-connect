import { UseFormHandleSubmit } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RxCross2 } from 'react-icons/rx';

type RecentSearchListProps = {
  recentSearches: string[];
  handleSubmit: UseFormHandleSubmit<
    {
      searchQuery: string;
      recentSearches: string[];
    },
    undefined
  >;
  handleSearch: () => void;
  handleRecentSearchClick: (term: string) => Promise<void>;
  handleRecentSearchDelete: (term: string) => void;
};

const RecentSearchList = ({
  recentSearches,
  handleSubmit,
  handleSearch,
  handleRecentSearchClick,
  handleRecentSearchDelete,
}: RecentSearchListProps) => {
  const { t } = useTranslation('search');
  return (
    <>
      {/* 중앙 정렬을 위한 부모 컨테이너 */}
      <div className="w-full flex justify-center">
        <ul className="flex max-w-[1200px] w-full flex-row gap-[8px] md:gap-[12px] items-center overflow-x-auto whitespace-nowrap menuscrollbar md:mx-[25px]">
          {recentSearches && recentSearches.length > 0 ? (
            recentSearches.map((term, index) => (
              <li
                key={index}
                className="flex flex-row justify-between items-center rounded-full border border-[#DFE1E5] mt-[20px] flex-shrink-0"
              >
                <form
                  onSubmit={handleSubmit(handleSearch)}
                  className="flex flex-row items-center px-[16px] py-[9.5px]"
                >
                  <button
                    type="submit"
                    className="text-[14px] text-[#45484D] pr-[4px]"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    {term}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRecentSearchDelete(term)}
                  >
                    <RxCross2
                      size={16}
                      className="cursor-pointer"
                      style={{ color: '#797C80' }}
                    />
                  </button>
                </form>
              </li>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center w-full">
              <p className="text-[#797C80] text-[16px] font-[600] pt-10 text-center">
                {t('pleaseinput')}
              </p>
            </div>
          )}
        </ul>
      </div>
    </>
  );
  
};
export default RecentSearchList;

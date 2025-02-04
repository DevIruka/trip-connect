import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const down = '/images/ic-down.svg';

type SelectBoxProps = {
  filter: 'all' | 'question' | 'answer';
  setFilter: (value: 'all' | 'question' | 'answer') => void;
};

const CustomSelectBox = ({ filter, setFilter }: SelectBoxProps) => {
  const { t } = useTranslation('search');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: 'all' | 'question' | 'answer') => {
    setFilter(value);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center items-center relative md:pr-[36px]">
      <div
        className="flex items-center justify-end text-right h-[29px] w-[80px] rounded py-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="w-[56px] text-[14px] tracking-[-0.28px]">
          {filter === 'all'
            ? t('q&a')
            : filter === 'question'
            ? t('q')
            : t('a')}
        </p>
        <Image src={down} width={20} height={20} alt="down" className='ml-1'/>
      </div>

      {isOpen && (
        <ul className="flex flex-col items-center justify-center absolute top-7 right-0 bg-white border rounded-[8px] mt-2 w-[129px] shadow-lg z-10">
          <li
            className={`flex items-center h-[29px] justify-start mt-[8px] mb-[2px] w-[113px] px-3 py-2 cursor-pointer border-black rounded-[8px] ${
              filter === 'all'
                ? 'bg-[#EBF5FF] text-[#0582FF] font-semibold'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelect('all')}
          >
            {t('q&a')}
          </li>
          <li
            className={`flex items-center justify-start h-[29px] my-[2px] w-[113px] px-3 py-2 cursor-pointer border-black rounded-[8px] ${
              filter === 'question'
                ? 'bg-[#EBF5FF] text-[#0582FF] font-semibold'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelect('question')}
          >
            {t('q')}
          </li>
          <li
            className={`flex items-center justify-start h-[29px] mt-[2px] mb-[8px] w-[113px] px-3 py-2 cursor-pointer border-black rounded-[8px] ${
              filter === 'answer'
                ? 'bg-[#EBF5FF] text-[#0582FF] font-semibold'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelect('answer')}
          >
            {t('a')}
          </li>
        </ul>
      )}
    </div>
  );
};

export default CustomSelectBox;

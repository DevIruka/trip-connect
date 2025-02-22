import React from 'react';
import { CreditBalanceProps } from '../_types/credit';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const coin = '/images/goldcoin.svg';

const CreditBalance: React.FC<CreditBalanceProps> = ({ credit }) => {
  const{t} = useTranslation('credit')
  return (
    <div className="mb-[34px] md:mt-[40px] max-w-[800px] mx-auto">
      <h2 className="text-black text-[20px] font-[700] mb-[20px]">
      {t('creditBalance')}
      </h2>
      <div className="border-solid border-[#F4F4F4] shadow-[0px_0px_24px_0px_rgba(0,0,0,0.05)] rounded-lg p-4 flex items-center">
        <div className='flex flex-row justify-center items-center'>
          <Image src={coin} width={24} height={24} alt="coin" />
          <p className="text-[18px] pt-[1px] ml-[8px] font-[600]">
            {credit?.toLocaleString()} C
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditBalance;

import React, { useState } from 'react';
import { PaymentOptionsProps } from '../_types/credit';
import PaymentModal from './PaymentModal';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  options,
  onPayment,
}) => {
  const { t } = useTranslation('credit');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedBonus, setSelectedBonus] = useState(0);

  const isMd = useMediaQuery({ minWidth: 800 });

  const openModal = (amount: number) => {
    const selectedOption = options.find((option) => option.amount === amount);
    if (selectedOption) {
      setSelectedAmount(amount);
      setSelectedBonus(Math.floor(amount * (selectedOption.bonusRate || 0)));
      setIsModalOpen(true);
    }
  };

  const calculateCredit = (amount: number) => {
    const selectedOption = options.find((option) => option.amount === amount);
    if (selectedOption) {
      setSelectedAmount(amount);
      setSelectedBonus(Math.floor(amount * (selectedOption.bonusRate || 0)));
      if (!isMd) {
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const onConfirm = (method: string) => {
    if (method === 'tosspay') {
      onPayment(selectedAmount, selectedBonus);
    } else {
      alert('지원되지 않는 결제 방식입니다.');
    }
    closeModal();
  };

  return (
    <div className="space-y-[12px] md:space-y-[18px] mb-[33px]">
      {options.map(({ amount, bonusRate }) => {
        const bonus = Math.floor(amount * (bonusRate || 0));
        return (
          <div
            key={amount}
            className="bg-white rounded-[12px] border-[1px] border-[#DFE1E5] p-4 flex items-center justify-between md:h-[96px] h-[65px]"
          >
            <div>
              <p className="text-[#44484c] text-base font-semibold ">
                {amount.toLocaleString()}C
              </p>
              {bonus > 0 && (
                <div className="flex flex-row items-center">
                  <p className="text-[#0582ff] text-sm font-medium leading-tight mt-[2px] mr-[2px]">
                    +{bonus.toLocaleString()}
                  </p>
                  <span className="text-[#44484c] text-sm font-medium leading-tightmt-[2px]">
                    {t('amountWithBonus')}
                  </span>
                </div>
              )}
            </div>
            <button
              className="bg-[#EBF5FF] text-center text-[#0582ff] text-sm font-medium px-[19px] py-[8px] rounded-[8px]"
              onClick={() => calculateCredit(amount)}
            >
              {amount.toLocaleString()}
              {t('won')}
            </button>
          </div>
        );
      })}

      {isMd && (
        <div className="hidden md:flex w-full items-center justify-center sticky bottom-0 py-4">
          <button
            className={`mt-[28px] mb-[16px] mx-auto w-[180px] h-[50px] rounded-full text-lg font-semibold shadow-md
              ${
                selectedAmount !== 0
                  ? 'bg-[#0582ff] text-white'
                  : 'bg-[#DFE1E5] text-[#A9A9A9] cursor-not-allowed'
              }`}
            onClick={() => openModal(selectedAmount)}
            disabled={selectedAmount === 0}
          >
            {selectedAmount !== 0
              ? t('confirmPayment', {
                  amount: selectedAmount.toLocaleString(),
                })
              : t('selectAmount')}
          </button>
        </div>
      )}

      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        amount={selectedAmount}
        bonus={selectedBonus}
        customerName="사용자 이름"
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default PaymentOptions;

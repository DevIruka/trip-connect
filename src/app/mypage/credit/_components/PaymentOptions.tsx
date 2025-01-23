import React, { useState } from 'react';
import { PaymentOptionsProps } from '../_types/credit';
import PaymentModal from './PaymentModal';
import { useTranslation } from 'react-i18next';

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  options,
  onPayment,
}) => {
  const {t} = useTranslation('credit')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedBonus, setSelectedBonus] = useState(0);

  const openModal = (amount: number) => {
    const selectedOption = options.find((option) => option.amount === amount);
    if (selectedOption) {
      setSelectedAmount(amount);
      setSelectedBonus(Math.floor(amount * (selectedOption.bonusRate || 0)));
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-[12px] mb-[33px]">
      {options.map(({ amount, bonusRate }) => {
        const bonus = Math.floor(amount * (bonusRate || 0));
        return (
          <div
            key={amount}
            className="bg-white rounded-[12px] border-[1px] border-[#DFE1E5] p-4 flex items-center justify-between"
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
              onClick={() => openModal(amount)}
            >
              {amount.toLocaleString()}{t('won')}
            </button>
          </div>
        );
      })}

      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        amount={selectedAmount}
        bonus={selectedBonus}
        customerName="사용자 이름"
        onConfirm={(method) => {
          if (method === 'tosspay') {
            onPayment(selectedAmount, selectedBonus);
          } else {
            alert('지원되지 않는 결제 방식입니다.');
          }
          closeModal();
        }}
      />
    </div>
  );
};

export default PaymentOptions;

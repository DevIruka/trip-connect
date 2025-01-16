import React, { useState } from 'react';
import { PaymentOptionsProps } from '../_types/credit';
import PaymentModal from './PaymentModal';

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  options,
  onPayment,
}) => {
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
    <div className="space-y-4">
      {options.map(({ amount, bonusRate }) => {
        const bonus = Math.floor(amount * (bonusRate || 0));
        return (
          <div
            key={amount}
            className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xl font-bold">{amount.toLocaleString()}C</p>
              {bonus > 0 && (
                <p className="text-blue-500 text-sm font-medium mt-1">
                  +{bonus.toLocaleString()} 추가 크레딧
                </p>
              )}
            </div>
            <button
              className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg"
              onClick={() => openModal(amount)}
            >
              {amount.toLocaleString()}원
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

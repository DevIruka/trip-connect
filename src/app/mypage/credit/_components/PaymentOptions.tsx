import React from 'react';
import { PaymentOptionsProps } from '../_types/credit';

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ options, onPayment }) => {
  return (
    <div className="space-y-4">
      {options.map(({ amount, bonusRate }) => {
        const bonus = Math.floor(amount * bonusRate);
        return (
          <div
            key={amount}
            className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xl font-bold">{amount.toLocaleString()}C</p>
              <p className="text-blue-500 text-sm font-medium mt-1">
                +{bonus.toLocaleString()} 추가 크레딧
              </p>
            </div>
            <button
              className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg"
              onClick={() => onPayment(amount, bonus)}
            >
              {amount.toLocaleString()}원
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentOptions;

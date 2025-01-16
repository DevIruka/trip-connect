'use client';

import React, { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bonus: number;
  customerName: string;
  onConfirm: (method: string) => void;
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  bonus,
  customerName,
  onConfirm,
}) => {
  const [selectedMethod, setSelectedMethod] = useState('tosspay');

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-lg p-6 z-50">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-gray-500">
            X
          </button>
          <h2 className="text-lg font-bold">결제하기</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="tosspay"
              name="paymentMethod"
              value="tosspay"
              checked={selectedMethod === 'tosspay'}
              onChange={() => setSelectedMethod('tosspay')}
            />
            <label htmlFor="tosspay" className="ml-2">
              토스페이
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="paypal"
              disabled
            />
            <label htmlFor="paypal" className="ml-2 text-gray-400">
              PayPal <span className="text-xs">(조금만 기다려주세요!)</span>
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="card"
              name="paymentMethod"
              value="card"
              disabled
            />
            <label htmlFor="card" className="ml-2 text-gray-400">
              신용/체크카드
              <span className="text-xs">(조금만 기다려주세요!)</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full mt-6"
        >
          {amount.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;

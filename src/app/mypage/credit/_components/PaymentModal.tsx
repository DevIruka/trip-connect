'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import BlueButton from '@/components/BlueBtn';
import { useTranslation } from 'react-i18next';

const xbutton = '/images/ic-Close.svg';

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
  onConfirm,
}) => {
  const { t } = useTranslation('credit');
  const [selectedMethod, setSelectedMethod] = useState('tosspay');

  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div
        className="absolute bottom-0 left-0 w-full bg-white rounded-t-[20px] pt-[18px] px-[20px] z-50 
                      md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-lg md:w-[400px] md:py-[32px] md:px-0 md:w-[686px] md:h-[478px] md:px-[54px]"
      >
        <div className="flex items-center justify-center relative md:justify-between mb-[22px] md:px-[20px]">
          <h2 className="text-[18px] font-[600] md:text-[#44484c] md:text-lg md:font-semibold">
            {t('paymentTitle')}
          </h2>
          <Image
            src={xbutton}
            width={24}
            height={24}
            alt="close"
            onClick={onClose}
            className="absolute top-0 left-0 md:static md:ml-auto cursor-pointer md:filter md:grayscale md:opacity-50"
          />
        </div>

        <div className="space-y-[24px] md:space-y-0">
          <div className="flex items-center md:py-[28px] md:px-[20px]">
            <input
              type="radio"
              id="tosspay"
              name="paymentMethod"
              value="tosspay"
              checked={selectedMethod === 'tosspay'}
              onChange={() => setSelectedMethod('tosspay')}
              className="hidden peer"
            />
            <div className="w-[22px] h-[22px] border-[1.5px] border-[#DFE1E5] rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 relative">
              <div className="w-[10px] h-[10px] bg-white rounded-full"></div>
            </div>
            <label htmlFor="tosspay" className="ml-2 font-semibold text-[16px] md:text-lg md:font-semibold">
              {t('tossPay')}
            </label>
          </div>
          <div className="flex items-center justify-between md:py-[28px] md:px-[20px]">
            <div className="flex flex-row items-center">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                className="hidden peer"
                disabled
              />
              <div className="w-[22px] h-[22px] border-[1.5px] border-[#DFE1E5] rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 relative">
                <div className="w-[10px] h-[10px] bg-white rounded-full"></div>
              </div>
              <label htmlFor="paypal" className="ml-2 text-[#A9A9A9] md:text-lg md:font-semibold">
                PayPal
              </label>
            </div>
            <span className="text-[12px] font-[500] text-[#A9A9A9] md:text-base md:font-medium">
              {t('comingSoon')}
            </span>
          </div>
          <div className="flex items-center justify-between md:py-[28px] md:px-[20px]">
            <div className="flex flex-row items-center">
              <input
                type="radio"
                id="card"
                name="paymentMethod"
                value="card"
                className="hidden peer"
                disabled
              />
              <div className="w-[22px] h-[22px] border-[1.5px] border-[#DFE1E5] rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 relative">
                <div className="w-[10px] h-[10px] bg-white rounded-full"></div>
              </div>
              <label htmlFor="card" className="ml-2 text-[#A9A9A9] md:text-lg md:font-semibold">
                {t('creditCard')}
              </label>
            </div>
            <span className="text-[12px] font-[500] text-[#A9A9A9] md:text-base md:font-medium">
              {t('comingSoon')}
            </span>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <BlueButton
            className="mt-[28px] mb-[16px] mx-auto"
            onClick={handleConfirm}
          >
            {t('confirmPayment', { amount: amount.toLocaleString() })}
          </BlueButton>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

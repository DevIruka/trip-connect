import BlueButton from '@/components/BlueBtn';
import React from 'react';
import { useTranslation } from 'react-i18next';

type DesktopPaymentOptionsProps = {
  selectedMethod: string;
  selectedAmount: number;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>
  onConfirm: (method: string) => void;
};

const DesktopPaymentOptions = ({
  selectedMethod,
  setSelectedMethod,
  selectedAmount,
  onConfirm,
}: DesktopPaymentOptionsProps) => {
  const { t } = useTranslation('credit');
  const handleConfirm = () => {
    onConfirm(selectedMethod);
  };
  return (
    <div className="w-full bg-white">
      <div className="flex relative items-start mb-[22px] mt-[42px]">
        <h2 className="text-xl font-[600]">{t('paymentTitle')}</h2>
      </div>

      <div>
        {[
          { id: 'tosspay', label: t('tossPay'), disabled: false, border: '' },
          { id: 'paypal', label: 'PayPal', disabled: true, border: 'border-t border-b' },
          { id: 'card', label: t('creditCard'), disabled: true, border: '' },
        ].map(({ id, label, disabled, border }) => (
          <div key={id} className={`flex items-center justify-between py-[28px] ${border}`}>
            <div className="flex flex-row items-center">
              <input
                type="radio"
                id={id}
                name="paymentMethod"
                value={id}
                checked={selectedMethod === id}
                onChange={() => setSelectedMethod(id)}
                className="hidden peer"
                disabled={disabled}
              />
              <div className="w-[22px] h-[22px] border-[1.5px] border-[#DFE1E5] rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500 relative">
                <div className="w-[10px] h-[10px] bg-white rounded-full"></div>
              </div>
              <label htmlFor={id} className={`ml-2 text-[16px] ${disabled ? 'text-[#A9A9A9]' : 'font-semibold'}`}>
                {label}
              </label>
            </div>
            {disabled && <span className="text-[12px] font-[500] text-[#A9A9A9]">{t('comingSoon')}</span>}
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center">
        <BlueButton
          className="mt-[28px] mb-[16px] mx-auto"
          onClick={handleConfirm}
          disabled={selectedAmount === 0}
        >
          {selectedAmount === 0
            ? t('paymentTitle')
            : t('confirmPayment', {
                amount: selectedAmount.toLocaleString(),
              })}
        </BlueButton>
      </div>
    </div>
  );
};

export default DesktopPaymentOptions;

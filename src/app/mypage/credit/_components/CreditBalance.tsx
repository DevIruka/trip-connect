import React from 'react';
import { CreditBalanceProps } from '../_types/credit';

const CreditBalance: React.FC<CreditBalanceProps> = ({ credit }) => {
  return (
    <div className="mb-6">
      <h2 className="text-gray-600 text-lg font-medium mb-2">보유 크레딧</h2>
      <div className="bg-gray-100 rounded-lg p-4 flex items-center">
        <div className="w-16 h-16 bg-gray-300 rounded mr-4" />
        <p className="text-3xl font-bold">{credit?.toLocaleString()}c</p>
      </div>
    </div>
  );
};

export default CreditBalance;

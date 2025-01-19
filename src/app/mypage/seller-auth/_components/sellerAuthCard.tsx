import React from 'react';
import Button from './button';

const SellerAuthCard = ({
  isVerified,
  title,
  content,
  link,
}: {
  isVerified: boolean;
  title: string;
  content: string;
  link: string;
}) => {
  return (
    <div className="h-auto p-4 rounded-xl border border-[#dee1e5] grid gap-3">
      <div className="grid gap-2">
        <div className="flex space-x-1.5">
          <h3 className="text-black text-base font-semibold leading-snug">
            {title} 인증
          </h3>
          {/* 완료 상태 박스 */}
          {isVerified && (
            <div className="h-[22px] px-1.5 py-[5px] bg-[#eaf4ff] rounded justify-start items-center inline-flex text-center text-[#0079f2] text-xs font-medium">
              완료
            </div>
          )}
        </div>
        <p className="text-[#797c80] text-xs font-medium">{content}</p>
      </div>
      <Button isVerified={isVerified} text={title} link={link} />
    </div>
  );
};

export default SellerAuthCard;

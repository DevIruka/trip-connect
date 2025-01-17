import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const BlueButton = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-[#0582FF] text-white text-[16px] font-[600] w-full h-[52px] rounded-[12px] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default BlueButton;

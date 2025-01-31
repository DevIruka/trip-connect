import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const BlueButton = ({ children, className = '', disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={`w-full max-w-[480px] h-[52px] md:h-[60px] rounded-[12px] text-white text-[16px] font-[600] 
        ${disabled ? 'bg-[#C6C9CC] cursor-not-allowed' : 'bg-[#0582FF] cursor-pointer'} 
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default BlueButton;

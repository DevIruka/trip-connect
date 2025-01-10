import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const BlackButton = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`border bg-black text-white w-[256px] h-12 rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default BlackButton;

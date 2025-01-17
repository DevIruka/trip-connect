import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  placeholder: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, placeholder, type = 'text', className = '', ...props }, ref) => {
    return (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        ref={ref}
        className={`border border-[#DFE1E5] rounded-md h-[52px] w-full px-[16px] py-[14px] ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input'; // forwardRef 사용 시 컴포넌트 이름 명시

export default Input;

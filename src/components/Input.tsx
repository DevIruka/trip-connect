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
        className={`border border-[E5E5EC] rounded-md h-10 w-64 mt-1 mb-1 p-2 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input'; // forwardRef 사용 시 컴포넌트 이름 명시

export default Input;

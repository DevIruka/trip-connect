import React from 'react';

const BoldIcon: React.FC<{ color?: string }> = ({ color = '#797C80' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 11.6667H8M12 11.6667C12 11.6667 15.3333 11.6667 15.3333 8.33333C15.3333 5.00002 12 5 12 5H8.6C8.26863 5 8 5.26863 8 5.6V11.6667M12 11.6667C12 11.6667 16 11.6667 16 15.3333C16 19 12 19 12 19H8.6C8.26863 19 8 18.7314 8 18.4V11.6667"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

export default BoldIcon;

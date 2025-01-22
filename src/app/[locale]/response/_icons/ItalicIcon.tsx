import React from 'react';

const ItalicIcon: React.FC<{ color?: string }> = ({ color = '#797C80' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 5H14M14 5H17M14 5L10 19M10 19H7M10 19H13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ItalicIcon;

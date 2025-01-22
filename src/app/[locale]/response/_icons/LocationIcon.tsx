import React from 'react';

const LocationIcon: React.FC<{ color?: string }> = ({ color = '#45484D' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 7.5C15 10.3805 10.4664 15.0537 9.28087 16.2264C9.12345 16.3821 8.87655 16.3821 8.71913 16.2264C7.53364 15.0537 3 10.3805 3 7.5C3 4.18629 5.68629 1.5 9 1.5C12.3137 1.5 15 4.18629 15 7.5Z"
      fill={color}
      stroke={color}
      strokeWidth="0.833333"
    />
    <path
      d="M9 8.25C9.41422 8.25 9.75 7.91422 9.75 7.5C9.75 7.08579 9.41422 6.75 9 6.75C8.58578 6.75 8.25 7.08579 8.25 7.5C8.25 7.91422 8.58578 8.25 9 8.25Z"
      fill="#F5F7FA"
      stroke="#F5F7FA"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LocationIcon;

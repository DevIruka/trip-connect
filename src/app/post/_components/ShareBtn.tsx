'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import share from '@/data/images/ic-share.svg';
import AlertModal from './AlertModal';

const ShareBtn = () => {
  const [showAlert, setShowAlert] = useState(false);

  const copyLink = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowAlert(true); // 알림 표시

      // 1.5초 후 알림 숨기기
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
    } catch (e) {
      alert('초대코드 복사 실패');
    }
  };
  return (
    <>
      <button onClick={copyLink}>
        <Image width={24} height={24} src={share} alt="share button" />
      </button>
      <AlertModal show={showAlert} message="링크가 복사되었습니다!" />
    </>
  );
};

export default ShareBtn;

import React from 'react';
import BackButton from '../post/_components/BackBtn';

const responseListPage = () => {
  return (
    <div className="inner text-center">
      <div className="h-12 flex place-content-between">
        <BackButton />
        <div className="grid place-content-center">답변하기</div>
      </div>
    </div>
  );
};

export default responseListPage;

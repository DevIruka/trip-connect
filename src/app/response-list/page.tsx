import React from 'react';
import BackHeader from '@/components/backHeader';
import search from '@/data/images/ic-Search.svg';

const responseListPage = () => {
  return (
    <div className="relative overflow-y-scroll menuscrollbar">
      <BackHeader image={search} text="답변하기" />
      <div>답변하기</div>
    </div>
  );
};

export default responseListPage;

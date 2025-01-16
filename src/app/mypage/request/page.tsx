'use client';

import React from 'react';
import UserProfileSection from '../_components/UserProfileSection';
import CategoryTabs from '../_components/CategoryTabs';
import FilterTabs from '../_components/FilterTabs';
import AllPosts from './filters/AllPosts';
import Questions from './filters/Questions';
import Answers from './filters/Answers';

const RequestPage = () => {
  const [activeFilter, setActiveFilter] = React.useState<
    'all' | 'question' | 'answer'
  >('all');

  return (
    <div className="px-5 space-y-4 min-h-screen">
      {/* 프로필 섹션 */}
      <UserProfileSection />

      {/* 카테고리 탭 */}
      <CategoryTabs activeTab="written" />

      {/* 작성글 필터링 탭 */}
      <FilterTabs
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
      />

      {/* 필터별 컴포넌트 렌더링 */}
      {activeFilter === 'all' && <AllPosts />}
      {activeFilter === 'question' && <Questions />}
      {activeFilter === 'answer' && <Answers />}
    </div>
  );
};

export default RequestPage;

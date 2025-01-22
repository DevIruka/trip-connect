// allpostpage로 통합하고 일단 주석처리
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useUserStore } from '@/store/userStore';
// import PostCard from './PostCard';
// import { fetchFilterPost, UnifiedPost } from '../_util/fetchFilterPost';

// type FilterTabsProps = {
//   activeFilter: 'all' | 'question' | 'answer';
//   onChangeFilter: (filter: 'all' | 'question' | 'answer') => void;
// };

// const FilterTabs: React.FC<FilterTabsProps> = ({
//   activeFilter,
//   onChangeFilter,
// }) => {
//   const { user } = useUserStore(); // 사용자 정보 가져오기
//   const [filteredData, setFilteredData] = useState<UnifiedPost[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) return;
//       const data = await fetchFilterPost(activeFilter, user.id); // 사용자 ID 전달
//       setFilteredData(data);
//     };
//     fetchData();
//   }, [activeFilter, user?.id]);

//   const tabs = [
//     { key: 'all', label: '전체' },
//     { key: 'question', label: '질문' },
//     { key: 'answer', label: '답변' },
//   ];

//   return (
//     <div className="flex flex-col">
//       {/* 필터 탭 UI */}
//       <div className="sticky top-0 z-50 bg-white shadow-md">
//         <div className="flex justify-center gap-4 my-4 relative">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() =>
//                 onChangeFilter(tab.key as 'all' | 'question' | 'answer')
//               }
//               className={`px-4 py-2 ${
//                 activeFilter === tab.key
//                   ? 'bg-black text-white'
//                   : 'bg-gray-200 text-black'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 포스트 카드 렌더링 */}
//       <div className="mt-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((post) => <PostCard key={post.id} post={post} />)
//         ) : (
//           <p className="text-center text-gray-500">게시물이 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterTabs;

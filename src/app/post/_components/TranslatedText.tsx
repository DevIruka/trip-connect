// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useGPTTranslation } from '../_hooks/TranslatedText';

// const TranslatedText = ({ postId }: { postId: string }) => {
//   const [resPosts, setResPosts] = useState();
//   useEffect(() => {
//     const fetchPosts = async () => {
//       const { data: response_posts } = await supabase
//         .from('response_posts')
//         .select('*')
//         .eq('request_id', postId);
//       setResPosts(response_posts);
//     };
//     fetchPosts();
//   }, []);

//   const text = resPosts ? resPosts[0]?.content_html : '';
//   const title = resPosts ? resPosts[0]?.title : '';
//   const { data: translatedText, isPending: isTextLoading } = useGPTTranslation(
//     `${postId}text`,
//     text,
//   );
//   const { data: translatedTitle, isPending: isTitleLoading } =
//     useGPTTranslation(`${postId}title`, title);
//   if (isTextLoading || isTitleLoading) {
//     return <p>Loading...</p>;
//   }
//   return translatedText;
// };

// export default TranslatedText;

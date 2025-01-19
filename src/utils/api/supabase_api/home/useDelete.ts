// import { supabase } from '@/utils/supabase/supabaseClient';

// export const useDelete = async (id, router) => {
//   const confirmDelete = confirm('정말로 삭제하시겠습니까?');
//   if (!confirmDelete) return;

//   try {
//     const { error } = await supabase
//       .from('response_posts')
//       .delete()
//       .eq('id', id);

//     if (error) throw error;

//     alert('삭제되었습니다.');
//     router.push('/request');
//   } catch (error) {
//     console.error('Error:', error);
//     alert('삭제 중 문제가 발생했습니다.');
//   }
// };

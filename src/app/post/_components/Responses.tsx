import Response from './Response';
import { fetchResPosts } from '../../../utils/api/supabase_api/post/fetchResPosts';

const Responses = async ({ postId }: { postId: string }) => {
  const { post: resPosts } = await fetchResPosts(postId);

  return (
    <>
      <div className="flex items-center p-5 text-[#44484c] text-base font-semibold leading-snug">
        <div className="text-[#0582ff]">{resPosts?.length}</div>개의 답변이
        있어요
      </div>
      <div className="border-b border-[#f3f3f3] md:border-transparent"></div>

      {resPosts
        ? resPosts.map((post) => {
            return <Response key={post.id} post={post} />;
          })
        : '게시물이 없어요'}
    </>
  );
};

export default Responses;

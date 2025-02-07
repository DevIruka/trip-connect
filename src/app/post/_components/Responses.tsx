import Response from './Response';
import { fetchResPosts } from '../../../utils/api/supabase_api/post/fetchResPosts';

const Responses = async ({
  postId,
  locale,
}: {
  postId: string;
  locale?: string;
}) => {
  const { post: resPosts } = await fetchResPosts(postId);

  return (
    <>
      <div className="flex items-center p-5 text-base font-semibold leading-snug">
        <div className={`text-[#44484c] flex ${locale === 'en' && 'gap-1'}`}>
          <div className="text-[#0582ff]">{resPosts?.length}</div>
          {locale === 'ko' ? '개의 답변이 있어요' : 'responses'}
        </div>
      </div>
      <div className="border-b border-[#f3f3f3] md:border-transparent"></div>

      <div className="md:place-items-center">
        {resPosts &&
          resPosts.map((post) => {
            return <Response key={post.id} post={post} />;
          })}
      </div>

      <div className="md:h-[200px]"></div>
    </>
  );
};

export default Responses;

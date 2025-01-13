import { supabase } from '@/utils/supabase/supabaseClient';
import RenderTranslatedHTML from './RenderTranslatedHTML';
import { GPTTranslator } from '../GPTTranslator';
import Profile from './profile';
import { getPostUser } from '@/utils/api/supabase_api/post/getPostUser';

const Responses = async ({ postId }: { postId: string }) => {
  const { data: response_posts } = await supabase
    .from('response_posts')
    .select('*')
    .eq('request_id', postId);

  const text = response_posts ? response_posts[0]?.content_html : '';
  const title = response_posts ? response_posts[0]?.title : '';

  const textResponse = await GPTTranslator(text);
  const translatedText = textResponse?.choices[0]?.message?.content || '';
  const titleResponse = await GPTTranslator(title);
  const translatedTitle = titleResponse?.choices[0]?.message?.content || '';

  return (
    <>
      <div className="h-12 flex items-center px-5">
        {response_posts?.length}개의 답변이 있어요
      </div>
      <div className="border-b-2"></div>

      {response_posts?.map(async (post) => {
        const user = await getPostUser(post.user_id);

        return (
          <div key={post.id} className="px-5 py-5 mb-5">
            <Profile user={user} />
            <div>
              <div className="h-12 grid items-center justify-start">
                <RenderTranslatedHTML data={JSON.parse(translatedTitle!)} />
                <button>원문보기</button>
              </div>
              <RenderTranslatedHTML data={JSON.parse(translatedText!)} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Responses;

import Link from 'next/link';
import { topicMapping } from '@/utils/topics';
import Responses from '../_components/Responses';
import BookmarkBtn from '../_components/BookmarkBtn';
import { supabase } from '@/utils/supabase/supabaseClient';
import BackButton from '../_components/BackBtn';
import { getPostUser } from '@/utils/api/supabase_api/post/getPostUser';
import Profile from '../_components/profile';

const DetailPage = async ({ params }: { params: { id: string } }) => {
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7';
  const postId = params.id; // URL에서 전달된 게시물 ID
  const { data: post, error } = await supabase
    .from('request_posts')
    .select('*')
    .eq('id', postId)
    .single(); // 단일 게시물 조회

  const user = await getPostUser(post.user_id);
  const topicArr = Object.entries(topicMapping);

  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="h-full w-full mx-auto relative overflow-y-scroll bg-gray-200">
      <div className="h-12 place-content-center bg-white px-5">
        <BackButton />
      </div>
      {post ? (
        <div className="bg-white px-5 pb-5 mb-5">
          <div className="grid grid-cols-1 gap-4">
            <Profile user={user} />
            <h1 className="text-xl font-bold place-content-center">
              {post.title}
            </h1>
            <div className="flex gap-2">
              {post.category
                ? topicArr
                    .filter(([_, value]) => post.category.includes(value))
                    .map(([key, _]) => (
                      <div
                        className="bg-gray-300 rounded-2xl py-1 px-2"
                        key={key}
                      >
                        {key}
                      </div>
                    ))
                : ''}
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-sm text-gray-400 grid gap-2">
                <div>여행 지역</div>
                <div>답변 기한</div>
                <div>크레딧</div>
              </div>
              <div className="text-sm grid gap-2">
                <div>{post.country_city}</div>
                <div>{post.date_end}</div>
                <div>{post.credit}C</div>
              </div>
            </div>
            <p>{post.content}</p>
            <div className="text-sm text-gray-400">
              한국어로 작성된 글이에요
            </div>
            <div className="h-16 flex border-t-2 place-content-end">
              <BookmarkBtn userId={userId} postId={postId} />
            </div>
          </div>
          <Link
            className="bg-gray-300 w-full h-12 rounded-lg flex justify-center items-center mb-5"
            href={`/response/${postId}`}
          >
            답변하기
          </Link>
        </div>
      ) : (
        <div>게시물을 찾을 수 없습니다.</div>
      )}

      {/* 답변 게시물 */}
      <div className="bg-white">
        <Responses postId={postId} />
      </div>
    </div>
  );
};

export default DetailPage;

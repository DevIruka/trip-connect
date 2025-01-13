// import { useRouter } from 'next/navigation';
import { usePost } from '../_hooks/usePost';
import Link from 'next/link';
import backButton from '../../../../public/images/back.svg';
import Image from 'next/image';
import { topicMapping } from '@/utils/topics';
import { getPostUser } from '@/utils/api/supabase_api/post/getPostUser';
import { useQuery } from '@tanstack/react-query';
import Responses from '../_components/Responses';
import BookmarkBtn from '../_components/BookmarkBtn';
import { supabase } from '@/utils/supabase/supabaseClient';

const DetailPage = async ({ params }: { params: { id: string } }) => {
  const userId = '0fdbd37c-1b2e-4142-b50b-e593f13487a7';
  // const router = useRouter();
  const postId = params.id; // URL에서 전달된 게시물 ID
  const { data: post, error } = await supabase
    .from('request_posts')
    .select('*')
    .eq('id', postId)
    .single(); // 단일 게시물 조회
  const topicArr = Object.entries(topicMapping);

  // const { data: user } = useQuery({
  //   queryKey: ['responseUser'],
  //   queryFn: async () => {
  //     await getPostUser(userId);
  //   },
  // });
  // console.log(user);

  // if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="inner">
      <div className="h-12 place-content-center">
        {/* <button onClick={() => router.back()}>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            src={backButton}
            alt="back button"
          />
        </button> */}
      </div>
      {post ? (
        <div>
          <div>닉네임</div>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
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
          <p className="text-sm text-gray-500 mb-4">
            여행 지역: {post.country_city}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            답변 기한: {post.date_end}
          </p>
          <p className="text-sm text-gray-500 mb-4">크레딧: {post.credit}</p>
          <p className="mb-4">{post.content}</p>
          <div className="h-12 flex border-t-2">
            <BookmarkBtn userId={userId} postId={postId} />
          </div>
          <div className="bg-gray-500 w-full h-12 rounded-sm px-2 flex justify-center items-center mb-5">
            <Link href={`/response/${postId}`}>답변하기</Link>
          </div>
        </div>
      ) : (
        <div>게시물을 찾을 수 없습니다.</div>
      )}

      {/* 답변 게시물 */}
      <Responses postId={postId} />
    </div>
  );
};

export default DetailPage;

import { topicMapping } from '@/utils/topics';
import Responses from '../_components/Responses';
import BookmarkBtn from '../_components/BookmarkBtn';
import Profile from '../_components/Profile';
import MoreButton from '@/data/images/ic-More.svg';
import Icon from '@/components/Icons';
import BackHeader from '@/components/BackHeader';
import PostDday from '@/app/home/_components/DDay';
import ResponseBtn from '../_components/ResponseBtn';
import ShareBtn from '../_components/ShareBtn';
import { fetchReqPost } from '../../../utils/api/supabase_api/post/fetchReqPost';
import LikeBtn from '../_components/LikeBtn';
import { cookies } from 'next/headers';

const DetailPage = async ({ params }: { params: { id: string } }) => {
  const postId = params.id; // URL에서 전달된 게시물 ID

  const topicArr = Object.entries(topicMapping);
  const { post, error } = await fetchReqPost(postId);

  const cookieStore = cookies();
  const locale = cookieStore.get('lang')?.value || 'en';
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="h-full w-full mx-auto relative overflow-y-scroll menuscrollbar mb-[76px] md:max-w-[800px] md:mb-0">
      <BackHeader
        image={MoreButton}
        text=""
        imagesize={20}
        isThreeDots={true}
        post={post}
      />
      {post ? (
        <div className="relative">
          <Profile
            postUserId={post.user_id}
            createdAt={post.created_at}
            mode="request"
            post={post}
          />
          <div className="px-5 grid grid-cols-1 gap-4">
            <div className="grid gap-1">
              <h1 className="text-black text-xl font-bold leading-[28.80px]">
                {locale === 'ko' ? (
                  post.title
                ) : (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.translated_title,
                    }}
                  />
                )}
              </h1>
              <div className="flex gap-2 flex-wrap">
                {post.category &&
                  topicArr
                    .filter(([_, value]) => post.category.includes(value))
                    .map(([key, value]) => (
                      <div
                        className="h-8 px-3 bg-[#f4f6f9] rounded-[100px] justify-center items-center gap-1 inline-flex text-center text-black text-sm font-semibold"
                        key={key}
                      >
                        <Icon type={value} size={20} />
                        <div className="pl-1">{key}</div>
                      </div>
                    ))}
              </div>
            </div>
            <div className="flex gap-4 items-center py-1">
              <div className="text-[#797c80] text-sm font-medium leading-tight grid gap-3">
                <div>여행 지역</div>
                <div>답변 기한</div>
                <div>크레딧</div>
              </div>
              <div className="text-black text-sm font-medium leading-tight grid gap-2.5">
                <div>{`${JSON.parse(post.country_city).country} / ${
                  JSON.parse(post.country_city).city
                }`}</div>
                <div className="flex gap-1 items-center">
                  {post.date_end}
                  <div className="px-1.5 rounded justify-center items-center inline-flex text-center text-xs font-medium">
                    <PostDday postDateEnd={post.date_end} />
                  </div>
                </div>
                <div>{post.credit} C</div>
              </div>
            </div>
            <p className="text-[#44484c] text-base font-medium leading-relaxed">
              {locale === 'ko' ? (
                post.content
              ) : (
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.translated_content,
                  }}
                />
              )}
            </p>
            <div className="text-[#7fbfff] text-xs font-medium leading-none py-1">
              한국어로 작성된 글이에요
            </div>
            <div className="border-t border-[#dee1e5] py-4 flex place-content-between">
              <LikeBtn postId={postId} />
              <div className="flex gap-5">
                <BookmarkBtn postId={postId} />
                <ShareBtn />
              </div>
            </div>
          </div>
          <div className="h-[5px] bg-[#f4f6f9] z-50 md:bg-transparent"></div>
          <ResponseBtn post={post} />
        </div>
      ) : (
        <div>게시물을 찾을 수 없습니다.</div>
      )}

      {/* 답변 게시물 */}
      <div>
        <Responses postId={postId} />
      </div>
    </div>
  );
};

export default DetailPage;

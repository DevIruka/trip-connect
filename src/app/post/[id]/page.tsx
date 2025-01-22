import Link from 'next/link';
import { topicMapping } from '@/utils/topics';
import Responses from '../_components/Responses';
import BookmarkBtn from '../_components/BookmarkBtn';
import { supabase } from '@/utils/supabase/supabaseClient';
import Profile from '../_components/profile';
import MoreButton from '@/data/images/ic-More.svg';
import Image from 'next/image';
import Icon from '@/components/Icons';
import Imoji from '@/data/images/ic-imoji.svg';
import share from '@/data/images/ic-share.svg';
import BackHeader from '../../../components/BackHeader';
import PostDday from '@/app/home/_components/dDay';

const DetailPage = async ({ params }: { params: { id: string } }) => {
  const postId = params.id; // URL에서 전달된 게시물 ID
  const { data: post, error } = await supabase
    .from('request_posts')
    .select('*')
    .eq('id', postId)
    .single(); // 단일 게시물 조회

  const topicArr = Object.entries(topicMapping);

  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="h-full w-full mx-auto relative overflow-y-scroll menuscrollbar mb-[76px]">
      <BackHeader image={MoreButton} text="" imagesize={20} />
      {post ? (
        <div className="relative">
          <Profile postUserId={post.user_id} />
          <div className="px-5 grid grid-cols-1 gap-4">
            <div className="grid gap-1">
              <h1 className="text-black text-xl font-bold leading-[28.80px]">
                {post.title}
              </h1>
              <div className="flex gap-2 flex-wrap">
                {post.category
                  ? topicArr
                      .filter(([_, value]) => post.category.includes(value))
                      .map(([key, value]) => (
                        <div
                          className="h-8 px-3 bg-[#f4f6f9] rounded-[100px] justify-center items-center gap-1 inline-flex text-center text-black text-sm font-semibold"
                          key={key}
                        >
                          <Icon type={value} size={20} />
                          <div className="pl-1">{key}</div>
                        </div>
                      ))
                  : ''}
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
              {post.content}
            </p>
            <div className="text-[#7fbfff] text-xs font-medium leading-none py-1">
              한국어로 작성된 글이에요
            </div>
            <div className="border-t border-[#dee1e5] py-4 flex place-content-between">
              <button className="flex place-items-center text-[#797c80] text-xs font-medium border border-[#dee1e5] py-1.5 pl-2 pr-2.5 rounded-full">
                <Image src={Imoji} alt="Imoji" height={20} width={20} />
                <div className="pl-[3px] pr-[5px]">나도 궁금해요</div>
                <div className="font-bold leading-none">0</div>
              </button>
              <div className="flex gap-5">
                <BookmarkBtn postId={postId} />
                <Image
                  width={24}
                  height={24}
                  src={share}
                  alt="bookmark button"
                />
              </div>
            </div>
          </div>
          <div className="h-[5px] bg-[#f4f6f9] z-50"></div>
          <div className="bg-white z-50 fixed bottom-0 w-[375px]">
            <Link className="blue-btn" href={`/response/${postId}`}>
              답변하기
            </Link>
          </div>
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

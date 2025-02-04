import React from 'react';
import Image from 'next/image';

import location from '@/data/images/ic-location.svg';
import coin from '@/data/images/coin.svg';
import dot from '@/data/images/Ellipse 14.svg';
import { useRouter } from 'next/navigation';
import { topicMapping } from '@/utils/topics';
import { Post } from '@/app/home/_types/homeTypes';
import RenderonlyTextHTML from '@/hook/home/RenderonlyTextHTML';
import TimeAgo from '@/app/search/[id]/_components/TimeAgo';
import { useReviewCount } from '@/utils/api/tanstack/home/useReviewCount';

const ListResPost = ({ post }: { post: Post }) => {
  const router = useRouter();
  const topicArr = Object.entries(topicMapping);

  const handleNavigation = (id: string | number) => {
    router.push(`/post/${id}`);
  };

  //리뷰 갯수
  const { reviewCount } = useReviewCount(post.id);

  return (
    <li
      onClick={() => handleNavigation(post.request_id!)}
      key={post.id}
      className="h-auto pt-3 pb-6 py-4 border-b border-[#f3f3f3] flex-col justify-start items-start gap-3 inline-flex cursor-pointer w-full md:p-5 md:border md:border-gray7 md:rounded-xl"
    >
      <div className="h-6 w-full justify-between items-center inline-flex gap-3">
        <div className="flex place-content-between items-center gap-1">
          {post.verified_country && (
            <div className="tag">
              <Image width={10} height={10} src={location} alt="location" />
              {post.verified_country}
            </div>
          )}
          {topicArr
            .filter(([_, value]) =>
              post.request_posts?.category.includes(value),
            )
            .map(([key, _]) => (
              <div className="tag pl-1.5" key={key}>
                {key}
              </div>
            ))}
        </div>
      </div>
      <div className="grid gap-2">
        <div className="flex gap-1.5 max-w-full">
          <div
            className={`text-base font-semibold leading-snug w-[16px] text-[#f94f5b]`}
          >
            A.
          </div>
          <h1 className="text-black text-base font-semibold leading-snug grow line-clamp-2 md:line-clamp-1">
            <p
              dangerouslySetInnerHTML={{
                __html: post.translated_title!,
              }}
            />
          </h1>
        </div>
        <div className="pl-[22px] max-h-[38.5px] text-[#797c80] text-sm font-medium leading-snug line-clamp-2 md:h-[38px]">
          <RenderonlyTextHTML
            data={{ original: '', translated: post.translated_free_content }}
          />
        </div>
      </div>
      <div className="flex gap-4 items-center text-[#797c80] text-xs font-medium justify-between w-full">
        <div className="flex gap-4">
          <div className="flex gap-1.5 items-center">
            <div className="flex gap-1 items-center">
              <Image width={18} height={18} src={coin} alt="coin" />
              {post.request_posts?.credit}
            </div>
            <Image width={2} height={2} src={dot} alt="dot" />
            <div className="flex gap-[2px]">
              작성자
              <div className="font-bold">{post.users?.nickname}</div>
            </div>
            <Image width={2} height={2} src={dot} alt="dot" />
            <div className="flex gap-[2px]">
              댓글
              <div className="font-bold">{reviewCount}</div>
            </div>
          </div>
        </div>
        <TimeAgo createdAt={post.created_at} />
      </div>
    </li>
  );
};

export default ListResPost;

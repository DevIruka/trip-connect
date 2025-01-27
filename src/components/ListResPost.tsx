import React from 'react';
import Image from 'next/image';

import location from '@/data/images/ic-location.svg';
import coin from '@/data/images/coin.svg';
import dot from '@/data/images/Ellipse 14.svg';
import { useRouter } from 'next/navigation';
import { topicMapping } from '@/utils/topics';
import { Post } from '@/app/home/_types/homeTypes';
import { useGPTTranslation } from '@/app/post/_hooks/TranslatedText';
import RenderonlyTextHTML from '@/hook/home/RenderonlyTextHTML';

const ListResPost = ({ post }: { post: Post }) => {
  const router = useRouter();
  const topicArr = Object.entries(topicMapping);

  const handleNavigation = (id: string | number) => {
    router.push(`/post/${id}`);
  };

  const { data: translatedTitle } = useGPTTranslation(
    `
    ${post.id}title`,
    `${post.title}`,
  );

  const { data: translatedContent } = useGPTTranslation(
    `
    ${post.id}freetext`,
    `${post.free_content}`,
  );
  return (
    <li
      onClick={() => handleNavigation(post.request_id!)}
      key={post.id}
      className="h-auto pt-3 pb-6 py-4 border-b border-[#f3f3f3] flex-col justify-start items-start gap-3 inline-flex cursor-pointer w-full md:w-[365px] md:p-5 md:border md:border-gray7 md:rounded-xl"
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
              <div className="tag" key={key}>
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
            {translatedTitle && (
              <p
                dangerouslySetInnerHTML={{
                  __html: JSON.parse(translatedTitle).translated,
                }}
              />
            )}
          </h1>
        </div>
        <div className="pl-[22px] max-h-[38.5px] text-[#797c80] text-sm font-medium leading-snug line-clamp-2 md:h-[38px]">
          {translatedContent && (
            <RenderonlyTextHTML data={JSON.parse(translatedContent)} />
          )}
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
          </div>
        </div>
        <div>1일 전</div>
      </div>
    </li>
  );
};

export default ListResPost;

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { topicMapping } from '@/utils/topics';
import { useBookmarkMutations } from '@/utils/api/tanstack/home/BookmarkHooks';
import { useBookmarks } from '@/utils/api/tanstack/home/useBookmark';

import { useUserStore } from '@/store/userStore';
import PostDday from '@/app/home/_components/DDay';

import location from '@/data/images/ic-location.svg';
import selectedBookmarkBtn from '@/data/images/ic-bookmark.svg';
import coin from '@/data/images/coin.svg';
import dot from '@/data/images/Ellipse 14.svg';
import bookmarkButton from '@/data/images/ic-bookmark-empty.svg';
import { Post } from '@/app/home/_types/homeTypes';
import { useModal } from '@/providers/ModalProvider';
import { Desktop, Mobile } from './ui/Responsive';

const ListReqPost = ({
  post,
  isReqList,
}: {
  post: Post;
  isReqList?: boolean;
}) => {
  const router = useRouter();
  const topicArr = Object.entries(topicMapping);
  const { openModal } = useModal();

  //로그인한 유저
  const { user } = useUserStore();
  const userId = user?.id;

  const { isPostBookmarked } = useBookmarks(userId);
  const bookmarked = isPostBookmarked(post.id);

  const { addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarkMutations(userId);
  const handleNavigation = (id: string | number) => {
    router.push(`/post/${id}`);
  };
  const handleResNavigation = (address: string) => {
    router.push(address);
  };

  return (
    <li
      onClick={() => handleNavigation(post.id)}
      key={post.id}
      className={`h-auto pt-3 pb-6 py-4 border-b border-[#f3f3f3] flex-col justify-start items-start gap-3 inline-flex cursor-pointer w-full md:p-5 md:border md:border-gray7 md:rounded-xl ${
        isReqList && 'md:p-9'
      }`}
    >
      <div className="h-6 w-full justify-between items-center inline-flex gap-3">
        <div className="flex place-content-between items-center gap-1">
          <PostDday postDateEnd={post.date_end!} />
          <div className="tag">
            <Image width={10} height={10} src={location} alt="location" />
            {JSON.parse(post.country_city!).country}
          </div>
          {topicArr
            .filter(([_, value]) => post.category?.includes(value))
            .map(([key, _]) => (
              <div className="tag" key={key}>
                {key}
              </div>
            ))}
        </div>
        {bookmarked ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBookmarkMutation.mutate(post.id);
            }}
          >
            <Image
              width={20}
              height={20}
              src={selectedBookmarkBtn}
              alt="bookmark button"
            />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (userId) {
                addBookmarkMutation.mutate(post.id);
              } else {
                openModal('loginModal');
              }
            }}
          >
            <Image
              width={20}
              height={20}
              src={bookmarkButton}
              alt="bookmark button"
            />
          </button>
        )}
      </div>
      <div className="grid gap-2">
        <div className="flex gap-1.5 max-w-full">
          <div
            className={`text-base font-semibold leading-snug w-[16px] text-[#0582ff]`}
          >
            Q.
          </div>
          <h1 className="text-black text-base font-semibold leading-snug grow line-clamp-2 md:line-clamp-1">
            {post.title}
          </h1>
        </div>
        <div className="pl-[22px] text-[#797c80] text-sm font-medium leading-snug line-clamp-2 md:h-[38px]">
          {post.content}
        </div>
      </div>
      <div className="flex gap-4 items-center text-[#797c80] text-xs font-medium justify-between w-full">
        <div className="flex gap-4">
          <div className="flex gap-1.5 items-center">
            <div className="flex gap-1 items-center">
              <Image width={18} height={18} src={coin} alt="coin" />
              {post.credit}
            </div>
            <Image width={2} height={2} src={dot} alt="dot" />
            <div>1명 답변</div>
            {isReqList && (
              <Desktop>
                <Image width={2} height={2} src={dot} alt="dot" />
                <div>1일 전</div>
              </Desktop>
            )}
          </div>
        </div>
        {isReqList && <Mobile>1일 전</Mobile>}
        {!isReqList && <div>1일 전</div>}
        {isReqList && (
          <Desktop>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (userId) {
                  handleResNavigation(`response/${post!.id}`);
                } else {
                  openModal('loginModal');
                }
              }}
              className="w-full h-11 bg-[#eaf4ff] rounded-[10px] justify-center items-center inline-flex text-[#0079f2] text-sm font-semibold md:max-w-[136px]"
            >
              답변하기
            </button>
          </Desktop>
        )}
      </div>
      {isReqList && (
        <Mobile>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (userId) {
                handleResNavigation(`response/${post!.id}`);
              } else {
                openModal('loginModal');
              }
            }}
            className="w-full h-11 bg-[#eaf4ff] rounded-[10px] justify-center items-center inline-flex text-[#0079f2] text-sm font-semibold md:max-w-[136px]"
          >
            답변하기
          </button>
        </Mobile>
      )}
    </li>
  );
};

export default ListReqPost;

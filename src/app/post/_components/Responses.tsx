'use client';
import { supabase } from '@/utils/supabase/supabaseClient';
import RenderTranslatedHTML from './RenderTranslatedHTML';
import Profile from './profile';
import { useEffect, useState } from 'react';
import { useGPTTranslation } from '../_hooks/TranslatedText';
import { Tables } from '@/types/supabase';
import original from '@/data/images/original.svg';
import Image from 'next/image';
import comment from '@/data/images/ic-comment.svg';
import updown from '@/data/images/ic-up&down.svg';
import MoreButton from '@/data/images/ic-More.svg';

const Responses = ({ postId }: { postId: string }) => {
  const [resPosts, setResPosts] = useState<Tables<'response_posts'>[] | null>();
  const [isContentVisible, setContentVisible] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false); // 구매 여부 상태
  const [credits, setCredits] = useState(10); // 사용자 크레딧

  const handlePurchase = () => {
    if (credits > 0) {
      setCredits((prev) => prev - 1); // 크레딧 차감
      setIsPurchased(true); // 구매 완료 상태
    } else {
      alert('크레딧이 부족합니다. 크레딧을 충전해주세요.');
    }
  };

  const toggleContent = () => {
    setContentVisible(!isContentVisible);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: response_posts } = await supabase
        .from('response_posts')
        .select('*')
        .eq('request_id', postId);
      setResPosts(response_posts);
    };
    fetchPosts();
  }, [postId]);

  const text = resPosts ? resPosts[0]?.content_html : '';
  const title = resPosts ? resPosts[0]?.title : '';
  const { data: translatedText, isPending: isTextLoading } = useGPTTranslation(
    `${postId}text`,
    text,
  );
  const { data: translatedTitle, isPending: isTitleLoading } =
    useGPTTranslation(`${postId}title`, title);
  // if (isTextLoading || isTitleLoading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <>
      <div className="flex items-center p-5 text-[#44484c] text-base font-semibold leading-snug">
        <div className="text-[#0582ff]">{resPosts?.length}</div>개의 답변이
        있어요
      </div>
      <div className="border-b border-[#f3f3f3]"></div>

      {resPosts
        ? resPosts.map((post) => {
            return (
              <div key={post.id} className="">
                <Profile postUserId={post.user_id} />
                <div className="px-5">
                  <div>
                    <div className="grid my-2 text-black text-lg font-bold leading-[28.80px]">
                      {/* <RenderTranslatedHTML data={JSON.parse(translatedTitle!)} /> */}
                      타이틀
                    </div>
                    <button className="h-6 px-2 py-1 rounded-[14px] border border-[#c5c8cc] justify-center items-center gap-1 inline-flex text-[#44484c] text-xs font-medium mb-5">
                      <Image
                        src={original}
                        alt="original"
                        height={14}
                        width={14}
                      />
                      원문보기
                    </button>
                    <div className="text-[#44484c] text-base font-medium leading-relaxed">
                      <RenderTranslatedHTML
                        data={{ original: '', translated: post.free_content! }}
                      />
                    </div>
                    {isContentVisible && (
                      <div className="text-[#44484c] text-base font-medium leading-relaxed pb-[18px]">
                        <RenderTranslatedHTML
                          data={JSON.parse(translatedText!)}
                        />
                      </div>
                    )}
                    {!isPurchased ? (
                      // 구매 버튼
                      <button
                        onClick={handlePurchase}
                        className="w-full h-11 bg-[#eaf4ff] rounded-[10px] justify-center items-center gap-2.5 inline-flex my-2.5 text-[#0079f2] text-sm font-semibold"
                      >
                        구매하고 전체보기
                      </button>
                    ) : (
                      // 콘텐츠 보기 버튼
                      <button
                        onClick={toggleContent}
                        className="w-full h-11 px-3 py-1.5 rounded-[100px] border border-[#dee1e5] justify-center items-center gap-1 inline-flex my-2.5 text-center text-[#44484c] text-sm font-semibold"
                      >
                        {isContentVisible ? '접기' : '펼쳐 보기'}
                        <Image
                          width={18}
                          height={18}
                          src={updown}
                          alt="updown"
                          className={`transform ${
                            isContentVisible ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  <div className="border-t border-[#dee1e5] p-4 flex place-content-between">
                    <div className="flex gap-1 text-[#44484c] text-xs font-bold leading-none items-center">
                      <Image
                        width={20}
                        height={20}
                        src={comment}
                        alt="comment"
                      />
                      0
                    </div>
                    <Image
                      width={20}
                      height={20}
                      src={MoreButton}
                      alt="MoreButton"
                    />
                  </div>
                </div>
                <div className="h-[5px] bg-[#f4f6f9] z-50"></div>
              </div>
            );
          })
        : '게시물이 없어요'}
    </>
  );
};

export default Responses;

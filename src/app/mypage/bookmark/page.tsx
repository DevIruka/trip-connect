'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';
import TimeAgo from '../_components/TimeAgo';
import CategoryTabs from '../_components/CategoryTabs';
import { convertTopicsToKorean, EnglishCategory } from '@/utils/topics';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useLang } from '@/store/languageStore';
import { countryNameMapping } from '@/data/nation';
import { capitalizeFirstLetter } from '@/app/search/_utils/capitalize';
import Dday from '@/app/search/[id]/_components/DDay';

type BookmarkedPost = {
  id: string;
  title: string;
  content: string | null;
  country_city: string;
  category: EnglishCategory[];
  date_end?: string | null;
  credit?: number | null;
  created_at: string | null;
};

const BookmarkPage = () => {
  const { lang } = useLang();
  const { t } = useTranslation('mypage');
  const { user } = useUserStore();
  const router = useRouter();
  const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responseCounts, setResponseCounts] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.id) {
        setError(t('noSession'));
        setLoading(false);
        return;
      }

      try {
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select(
            `request_posts (
            id,
            title,
            content,
            country_city,
            category,
            date_end,
            credit,
            created_at
          )`,
          )
          .eq('user_id', user.id);

        if (bookmarksError) {
          console.error(t('fetchError'), bookmarksError);
          setError(t('fetchError'));
          setLoading(false);
          return;
        }

        const mappedPosts: BookmarkedPost[] = (bookmarksData || []).flatMap(
          (bookmark: { request_posts: BookmarkedPost | BookmarkedPost[] }) =>
            Array.isArray(bookmark.request_posts)
              ? bookmark.request_posts
              : bookmark.request_posts
              ? [bookmark.request_posts]
              : [],
        );

        setBookmarkedPosts(mappedPosts);
        fetchResponseCounts(mappedPosts);
      } catch (e) {
        console.error(t('unexpectedError'), e);
        setError(t('unexpectedError'));
      } finally {
        setLoading(false);
      }
    };

    const fetchResponseCounts = async (posts: BookmarkedPost[]) => {
      const counts: { [key: string]: number } = {};

      await Promise.all(
        posts.map(async (post) => {
          const { count, error } = await supabase
            .from('response_posts')
            .select('*', { count: 'exact', head: true })
            .eq('request_id', post.id);

          if (!error && typeof count === 'number') {
            counts[post.id] = count;
          } else {
            counts[post.id] = 0;
          }
        }),
      );

      setResponseCounts(counts);
    };

    fetchBookmarks();
  }, [user, t]);

  const handleRemoveBookmark = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user?.id)
        .eq('request_id', postId);

      if (error) {
        console.error(t('removeError'), error);
        return;
      }

      setBookmarkedPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId),
      );
    } catch (e) {
      console.error(t('unexpectedError'), e);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 space-y-4 min-h-[calc(100vh-84px)]">
      <CategoryTabs activeTab="bookmark" />

      <div className="overflow-y-auto h-[calc(100vh-140px)] pb-[50px] md:pb-[140px] scrollbar-hide">
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => {
            const handleCardClick = () => {
              router.push(`/post/${post.id}`);
            };

            return (
              <div
                key={post.id}
                onClick={handleCardClick}
                className="flex flex-col items-start gap-3 pt-[12px] pr-[20px] pb-[24px] pl-[20px] md:mb-[10px] md:gap-[17px]
            md:rounded-[12px] md:border md:mx-auto md:border-[#DFE1E5] md:bg-white border-b bg-white w-full relative md:w-[800px] md:h-[252px] md:px-[36px] md:py-[28px]"
                style={{
                  borderBottom: '1px solid #F4F4F4',
                  background: '#FFF',
                  cursor: 'pointer',
                  minHeight: '252px',
                }}
              >
                <div className="flex flex-row items-center gap-2 md:mb-[8px]">
                  <Dday postDateEnd={post.date_end!} />

                  <div className="flex bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                    <Image
                      src="/images/ic-location.svg"
                      alt="Location"
                      width={12}
                      height={12}
                      priority
                    />
                    {lang === 'en'
                      ? countryNameMapping[
                          JSON.parse(post.country_city).country
                        ]
                      : JSON.parse(post.country_city).country}
                  </div>
                  {post.category.map((cat, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700"
                    >
                      {lang === 'en'
                        ? capitalizeFirstLetter(cat)
                        : convertTopicsToKorean([cat])[0]}
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-[6px] min-h-[50px]">
                  <p className="text-[16px] font-[600] text-[#0582FF] leading-[22.4px]">
                    Q.
                  </p>
                  <div className="flex flex-col">
                    <div className="md:h-[50px]">
                      <p className="text-[16px] font-bold md:text-[18px] text-black leading-[22.4px] max-w-[315px] line-clamp-2">
                        {post.title}
                      </p>
                    </div>
                    <div className="md:h-[50px]">
                      <p className="text-[14px] md:text-[16px] text-[#797C80] line-clamp-2">
                        {post.content || ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px] md:text-[14px] text-[#797C80] w-full ">
                  <div className="flex items-center gap-[6px]">
                    <div className="flex items-center gap-[6px]">
                      <Image
                        src="/images/coin.svg"
                        alt={t('creditIconAlt')}
                        width={14}
                        height={14}
                      />
                      <span>{post.credit || 0}</span>
                    </div>
                    <>
                      <div
                        style={{
                          width: '2px',
                          height: '2px',
                          borderRadius: '50%',
                          backgroundColor: '#797C80',
                        }}
                      />
                      <span>
                        {responseCounts[post.id] || 0} {t('responsesCount')}
                      </span>
                    </>
                  </div>
                  <TimeAgo
                    createdAt={post.created_at || new Date().toISOString()}
                  />
                </div>

                <div className="absolute top-3 right-3 md:top-10 md:right-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBookmark(post.id);
                    }}
                  >
                    <Image
                      src="/images/ic-selectedbookmark.svg"
                      alt={t('bookmarkIconAlt')}
                      width={24}
                      height={24}
                      placeholder="blur"
                      blurDataURL="/images/blur-placeholder.svg"
                    />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">{t('noBookmarks')}</div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;

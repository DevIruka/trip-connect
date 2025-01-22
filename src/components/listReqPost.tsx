import React from 'react';

const listReqPost = () => {
  return (
    <li
      onClick={() =>
        handleNavigation(post.request_id ? post.request_id : post.id)
      }
      key={post.id}
      className="h-auto pt-3 pb-6 py-4 border-b border-[#f3f3f3] flex-col justify-start items-start gap-3 inline-flex cursor-pointer w-full"
    >
      <div className="h-6 w-full justify-between items-center inline-flex gap-3">
        <div className="flex place-content-between items-center gap-1">
          {post.date_end ? <PostDday postDateEnd={post.date_end} /> : null}
          <div className="tag">
            <Image width={10} height={10} src={location} alt="location" />
            {post.request_id
              ? post.verified_country
              : JSON.parse(post.country_city!).country}
          </div>
          {post.category
            ? topicArr
                .filter(([_, value]) => post.category?.includes(value))
                .map(([key, _]) => (
                  <div className="tag" key={key}>
                    {key}
                  </div>
                ))
            : topicArr
                .filter(([_, value]) =>
                  post.request_posts?.category.includes(value),
                )
                .map(([key, _]) => (
                  <div className="tag" key={key}>
                    {key}
                  </div>
                ))}
        </div>
        {!post.request_id ? (
          bookmarked ? (
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
                  setIsModalOpen(true);
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
          )
        ) : (
          ''
        )}
      </div>
      <div className="grid gap-2">
        <div className="flex gap-1.5 max-w-full">
          <div
            className={`text-base font-semibold leading-snug w-[16px] ${
              post.request_id ? 'text-[#f94f5b]' : 'text-[#0582ff]'
            }`}
          >
            {post.request_id ? 'A.' : 'Q.'}
          </div>
          <h1 className="text-black text-base font-semibold leading-snug grow line-clamp-2">
            {post.title}
          </h1>
        </div>
        <div className="pl-[22px] text-[#797c80] text-sm font-medium leading-snug line-clamp-2">
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
            <div>{post.request_id ? '작성자 닉네임' : '1명 답변'}</div>
          </div>
        </div>
        <div>1일 전</div>
      </div>
    </li>
  );
};

export default listReqPost;

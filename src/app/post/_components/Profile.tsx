'use client';

import { Tables } from '@/types/supabase';
import { getPostUser } from '@/utils/api/supabase_api/post/getPostUser';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import profileImage from '@/data/images/profile-default.svg';
import location from '@/data/images/ic-location.svg';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import TimeAgo from '@/app/search/[id]/_components/TimeAgo';
import { Desktop } from '@/components/ui/Responsive';
import MoreButton from '@/data/images/ic-More.svg';
import SelectBox from '@/components/SelectBox';

const Profile = ({
  postUserId,
  createdAt,
  mode,
  post,
}: {
  postUserId: string;
  createdAt: string;
  mode?: string;
  post?: Tables<'request_posts'>;
}) => {
  const [user, setUser] = useState<Tables<'users'>>();
  const { user: logginedUser } = useUserStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (postUserId) {
        const user = await getPostUser(postUserId);
        setUser(user);
      }
    };
    fetchUser();
  }, [postUserId]);

  if (!user || !postUserId) {
    return <div>loading</div>;
  }
  const handleClick = () => {
    if (!logginedUser || logginedUser.id !== user.id) {
      router.push(`/user/${user.id}`);
    } else if (logginedUser.id === user.id) router.push('/mypage');
  };
  return (
    <div className="flex justify-between">
      <div
        onClick={handleClick}
        className="flex items-center gap-2 py-4 px-5 cursor-pointer"
      >
        {user.profile_img ? (
          <Image
            width={36}
            height={36}
            src={`${user.profile_img}`}
            alt="profile_image"
            className="rounded-full w-10 h-10"
          />
        ) : (
          <Image
            width={36}
            height={36}
            src={profileImage}
            alt="profile_image"
          />
        )}
        <div className="grid gap-1">
          <div className="flex items-center gap-1">
            <div className="text-center text-black text-sm font-semibold leading-tight">
              {user.nickname}
            </div>
            {user.country && (
              <div className="h-[20px] pl-1 pr-1.5 bg-[#f4f6f9] rounded-full justify-start items-center gap-0.5 inline-flex text-center text-[#44484c] text-xs font-medium">
                <Image width={10} height={10} src={location} alt="location" />
                {user.country}
              </div>
            )}
          </div>
          <div className="text-[#797c80] text-xs font-medium leading-none">
            <TimeAgo createdAt={createdAt} />
          </div>
        </div>
      </div>
      {mode === 'request' && (
        <Desktop>
          <button onClick={() => setIsModalOpen(!isModalOpen)} className="pr-5">
            <Image width={20} height={20} alt="MoreButton" src={MoreButton} />
          </button>
        </Desktop>
      )}

      {isModalOpen && (
        <div
          className="w-full h-screen absolute top-0 right-0"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <SelectBox user={logginedUser!} requestPost={post!} />
        </div>
      )}
    </div>
  );
};

export default Profile;

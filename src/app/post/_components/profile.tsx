'use client';

import { Tables } from '@/types/supabase';
import { getPostUser } from '@/utils/api/supabase_api/post/getPostUser';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Profile = ({ postUserId }: { postUserId: string }) => {
  const [user, setUser] = useState<Tables<'users'>>();
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

  return (
    <div className="h-12 flex items-center gap-2">
      <div className="bg-gray-300 rounded-full w-10 h-10">
        {user.profile_img && (
          <Image
            width={100}
            height={100}
            src={`${user.profile_img}`}
            alt="profile_image"
          />
        )}
      </div>
      <div>
        <div className="flex place-content-center gap-2">
          <div>{user.nickname}</div>
          <div className="text-sm bg-gray-300 rounded-md flex items-center px-1">
            {user.country}
          </div>
        </div>
        <div className="text-sm text-gray-400">1시간 전</div>
      </div>
    </div>
  );
};

export default Profile;

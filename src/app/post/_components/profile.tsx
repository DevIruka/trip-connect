import { Tables } from '@/types/supabase';
import Image from 'next/image';
import React from 'react';

const Profile = ({ user }: { user: Tables<'users'> }) => {
  return (
    <div className="h-12 flex items-center gap-2">
      <div className="bg-gray-300 rounded-full w-10 h-10">
        {user.profile_img ? (
          <Image
            width={100}
            height={100}
            src={`${user.profile_img}`}
            alt="profile_image"
          />
        ) : (
          ''
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

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/supabaseClient';
import { useUserStore } from '@/store/userStore';

const UserProfileSection = () => {
  const { user } = useUserStore(); 
  const [profileImg, setProfileImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImg = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile_img')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile image:', error);
          setProfileImg(null);
        } else {
          setProfileImg(data?.profile_img || null);
        }
      } catch (e) {
        console.error('Unexpected error:', e);
        setProfileImg(null);
      }
    };

    fetchProfileImg();
  }, [user?.id]);

  return (
    <div
      className="flex items-center justify-between mb-6"
      style={{ position: 'sticky', marginTop: '60px' }}
    >
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
          {profileImg ? (
            <Image
              src={profileImg}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {/* 기본 이미지 */}
            </div>
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-bold">나의 활동 내역</h2>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;

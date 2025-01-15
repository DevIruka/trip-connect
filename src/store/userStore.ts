'use client';

import { Tables } from '@/types/supabase';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { create } from 'zustand';

type UserState = {
  user: User | null;
  userTable: Tables<'users'> | null;
  isLogin: boolean;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userTable: null,
  isLogin: false,

  fetchUser: async () => {
    const supabase = createClient();
    const { data: userData, error: userDataError } =
      await supabase.auth.getUser();

    if (userDataError || !userData.user) {
      return;
    }

    if (userData) {
      set({
        user: userData.user,
        isLogin: true,
      });
    } else {
      set({
        user: null,
        userTable: null,
        isLogin: false,
      });
    }
  },

  fetchUserData: async (userId: string): Promise<void> => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('사용자 데이터 가져오기 오류:', error);
        return;
      }

      if (data) {
        const userData: Tables<'users'> = {
          id: data.id,
          authenticated: data.authenticated,
          country: data.country,
          created_at: data.created_at,
          credit: data.credit,
          email: data.email,
          introduction: data.introduction,
          nickname: data.nickname,
          profile_img: data.profile_img,
        };

        set({ userTable: userData, isLogin: true });
      }
    } catch (err) {
      console.error('사용자 데이터 가져오기 오류:', err);
    }
  },

  signOut: async () => {
    const supabase = createClient();

    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
      set({ user: null, userTable: null, isLogin: false });
      document.cookie =
        'supabase.auth.token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'; // 쿠키 삭제
    } catch (err) {
      console.error('로그아웃 오류:', err);
    }
  },
}));

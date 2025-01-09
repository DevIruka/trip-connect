'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { LoginInputs, Signup } from '@/types/authType';

export async function login(data: LoginInputs) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data: userData, error } = await supabase.auth.signInWithPassword(
    data,
  );

  if (error) {
    console.log(error);
    redirect('/error');
  }
  revalidatePath('/', 'layout');
  return { user: userData };
}

export async function signup(data: Signup) {
  const { email, nickname, password } = data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) {
    console.log(error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export const logout = async (): Promise<void> => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
};

export const getUser = async () => {
  const supabase = await createClient();
  const { data: userData, error: userDataError } =
    await supabase.auth.getUser();

  if (userDataError || !userData.user) {
    return null;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userData.user.id);

  if (error) {
    return null;
  }

  return user;
};





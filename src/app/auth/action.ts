import { createClient } from '@/utils/supabase/server';
import { supabase } from './../../utils/supabase/supabaseClient';
import { redirect } from 'next/navigation';

export const signin = async (formData) => {
  const { email, nickname, password } = formData;
  await createAccount(email, nickname, password);
  redirect('/');
};

const createAccount = async (email, nickname, password) => {
  const supabase = await createClient();
  const 
};

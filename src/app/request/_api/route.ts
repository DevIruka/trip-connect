
import { supabase } from '@/utils/supabase/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

  const body = await req.json();

  const { content, title, date_end, category, credit, country_city, user_id } = body;

  const { data, error } = await supabase.from('request_posts').insert([
    {
      content,
      title,
      date_end,
      category,
      credit,
      country_city,
      user_id,
    },
  ]);

  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

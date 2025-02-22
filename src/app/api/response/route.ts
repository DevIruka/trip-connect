import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/supabaseClient';

const validateQuery = (query: string | null) => {
  if (!query) throw new Error('검색어가 없습니다.');
  return query;
};

const fetchGooglePlace = async (query: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  if (!response.ok) {
    throw new Error(`Google API 오류: ${response.status}`);
  }

  return response.json();
};

const deletePost = async (id: string) => {
  const { error } = await supabase.from('response_posts').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = validateQuery(searchParams.get('query'));

    const data = await fetchGooglePlace(query);
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Google Places API 호출 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('예상치 못한 오류:', error);
      return NextResponse.json(
        { error: '알 수 없는 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '삭제할 ID가 제공되지 않았습니다.' },
        { status: 400 },
      );
    }
    await deletePost(id);

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('삭제 오류:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('예상치 못한 오류:', error);
      return NextResponse.json(
        { error: '알 수 없는 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  }
}

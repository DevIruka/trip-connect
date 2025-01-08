import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "검색어가 없습니다." }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google API 오류: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Google Places API 호출 오류:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("예상치 못한 오류:", error);
      return NextResponse.json({ error: "알 수 없는 오류가 발생했습니다." }, { status: 500 });
    }
  }
}

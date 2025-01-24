import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log('error', error);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'production';

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
            .from('users') // 유저 정보를 저장하는 테이블 (예: profiles)
            .select('nickname')
            .eq('id', user?.id) // user.id를 기준으로 검색
            .single();

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        if (profile) {

          if (profile?.nickname === 'guest') {
            // 닉네임이 없으면 설정 페이지로 이동
            return NextResponse.redirect(`${origin}/auth`);
          }
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else if (forwardedHost) {
        if (profile) {

          if (profile?.nickname === 'guest') {
            // 닉네임이 없으면 설정 페이지로 이동
            return NextResponse.redirect(`https://${forwardedHost}${next}/auth`);
          }
          return NextResponse.redirect(`https://${forwardedHost}${next}/auth`);
        }
      } else {
        if (profile) {

          if (profile?.nickname === 'guest') {
            // 닉네임이 없으면 설정 페이지로 이동
            return NextResponse.redirect(`https://${origin}${next}/auth`);
          }
          return NextResponse.redirect(`https://${origin}${next}/auth`);
        }
      }
    }
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

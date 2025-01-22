import { i18nConfig } from '../i18nConfig';
import { i18nRouter } from 'next-i18n-router';
import { type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';


export async function middleware(request: NextRequest) {
  // 1. 세션 업데이트 미들웨어
  await updateSession(request);

  // 2. i18n 라우터 미들웨어
  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import 'server-only';
import type { Database } from './types/supabase';

export async function middleware(req: NextRequest) {
  console.log('middleware');
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  if (req.nextUrl.pathname === '/login') {
    console.log('login画面なので、何もしない');
    return res;
  }

  // ユーザーのsessionを更新
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error.message);
  }

  console.log('session: ', data.session);
  if (!data.session) {
    console.log('loginしていないので、login画面にリダイレクト');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/hoge/:path*'],
};

/*
TODO

Uncaught SyntaxError: expected expression, got '<'
matcher: ['/:path*'] にすると、上記エラーが出る
これはNext.jsのバグ
*/

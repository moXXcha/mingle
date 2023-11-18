import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import 'server-only';
import { createClient } from './utils/supabase/middleware';

export async function middleware(req: NextRequest) {
  console.log('middleware');
  const res = NextResponse.next();
  const supabase = createClient(req);

  if (req.nextUrl.pathname === '/login') {
    console.log('login画面なので、何もしない');
    return res;
  }

  // ユーザーのsessionを更新
  const { data, error } = await supabase.supabase.auth.getSession();

  if (error) {
    console.log(error.message);
  }

  if (!data.session) {
    console.log('loginしていないので、login画面にリダイレクト');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const {
    data: { user },
  } = await supabase.supabase.auth.getUser();
  // hasUserNameがfalseなら、/onboardingにリダイレクト
  if (!user?.user_metadata.hasUserName) {
    console.log(
      'ユーザー名が登録されていないので、ユーザー名登録画面にリダイレクト',
    );
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // hasProfileがfalseなら、/onboardingにリダイレクト
  if (!user?.user_metadata.hasProfile) {
    console.log(
      'プロフィールが登録されていないので、プロフィール登録画面にリダイレクト',
    );
    return NextResponse.redirect(new URL('/onboarding', req.url));
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

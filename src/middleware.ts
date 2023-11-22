import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import 'server-only';
import { createClient } from './utils/supabase/middleware';

// TODO リファクタリング 関数に切り出す

export async function middleware(req: NextRequest) {
  console.log('middleware');
  const res = NextResponse.next();
  const supabase = createClient(req);

  const { data: session, error: sessionError } =
    await supabase.supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
  }
  // ユーザーのsessionを更新
  const { data, error } = await supabase.supabase.auth.getSession();

  if (error) {
    console.log(error.message);
  }

  // すでにloginしている場合に、/loginにアクセスした場合、/にリダイレクトする
  if (session.session && req.nextUrl.pathname === '/login') {
    console.log('loginしているので、/にリダイレクト');
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname === '/login') {
    console.log('login画面なので、何もしない');
    return res;
  }

  if (!data.session) {
    console.log('loginしていないので、login画面にリダイレクト');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const {
    data: { user },
  } = await supabase.supabase.auth.getUser();

  if (
    (!user?.user_metadata.hasUserName || !user?.user_metadata.hasProfile) &&
    req.nextUrl.pathname === '/onboarding'
  ) {
    console.log('onboarding画面なので、何もしない');
    return res;
  }

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

  // hasUserNameとhasProfileがtrue and /onboarding/にリダイレクト
  if (
    user?.user_metadata.hasUserName &&
    user?.user_metadata.hasProfile &&
    req.nextUrl.pathname === '/onboarding'
  ) {
    console.log(
      'ユーザー名とプロフィールが登録されているので、/にリダイレクト',
    );
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/onboarding'],
};

/*
Uncaught SyntaxError: expected expression, got '<'
matcher: ['/:path*'] にすると、上記エラーが出る
これはNext.jsのバグ
*/

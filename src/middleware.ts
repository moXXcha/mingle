import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import 'server-only';
import type { Database } from './types/supabase';

export async function middleware(req: NextRequest) {
  console.log('middleware');
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // ユーザーのsessionを更新
  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error.message);
  }

  console.log(session);
  if (!session) {
    console.log('loginしていないので、login画面にリダイレクト');
    return NextResponse.redirect('/login');
  }

  return res;
}

export const config = {
  matcher: ['/:path*'],
};

/*
TODO
動作していない
*/

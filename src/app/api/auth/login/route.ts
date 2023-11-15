import { AuthSchema } from '@/types/types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const formData = await req.formData();

  try {
    // validation
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    AuthSchema.parse({
      email,
      password,
    });

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 認証エラーの場合
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.redirect(requestUrl.origin, {
      status: 301,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // Zodのバリデーションエラーの場合
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      // その他のエラーの場合
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

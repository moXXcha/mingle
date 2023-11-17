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

    // sign uo
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // TODO オンボーディングにリダイレクトする
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

/*
TODO

buttonを押して、submitすると/にredirectされる

submitしたら、「メールを確認してください」と表示する
emailのurlからアクセスするが綺麗では？

submitしてapi/auth/signupが正常系で終了した時点でログインできている気がする
だとしたら、メールは不要では？
なぜメールが必要なのか？

*/

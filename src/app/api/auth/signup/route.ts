import { AuthSchema } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import 'server-only';
import { ZodError } from 'zod';

export async function POST(req: NextRequest) {
  console.log('signup START');
  const requestUrl = new URL(req.url);
  const formData = await req.formData();
  console.log('formData: ', formData);

  try {
    // validation
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('email: ', email);
    console.log('password: ', password);

    AuthSchema.parse({
      email,
      password,
    });

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // sign uo
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    });

    if (error) {
      console.log('supabase.auth.signUpのエラー: ', error.message);
      throw new Error(error.message);
    }

    // sessionを取得
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('user: ', user?.id);

    // user_metadataにonboarding開始のフラグを立てる
    const { error: updateUserByIdError } =
      await supabase.auth.admin.updateUserById(user?.id as string, {
        user_metadata: {
          onboardingStart: true,
        },
      });

    if (updateUserByIdError) {
      console.log(
        'supabase.auth.admin.updateUserByIdのエラー: ',
        updateUserByIdError.message,
      );
      throw new Error(updateUserByIdError.message);
    }

    // オンボーディングにリダイレクトする
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

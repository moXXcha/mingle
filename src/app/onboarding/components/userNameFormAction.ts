'use server';

import { createUser } from '@/server/user/user-dto';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import 'server-only';

export async function userNameFormAction(
  prevState: { message: string },
  formData: FormData,
) {
  const userName = formData.get('userName') as string;

  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('data is null');
    }

    await createUser(
      data.session?.user.id as string,
      userName,
      data.session?.user.email as string,
    );

    return { message: 'ユーザー名を登録しました' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}

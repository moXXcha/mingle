'use server';

import { createUser } from '@/server/user/user-dto';
import { createAdminAuthClient } from '@/utils/supabase/adminAuthClient';
import { cookies } from 'next/headers';
import 'server-only';

export async function userNameFormAction(
  _prevState: { message: string; isSuccess: boolean },
  formData: FormData,
) {
  // TODO 英字数字のみ許可する
  const userName = formData.get('userName') as string;

  const cookieStore = cookies();
  const supabase = createAdminAuthClient(cookieStore);

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

    // useNameを作成したFlagをtrueにする
    const { error: userError } = await supabase.auth.admin.updateUserById(
      data.session?.user.id as string,
      {
        user_metadata: {
          hasUserName: true,
        },
      },
    );

    if (userError) {
      throw new Error(userError.message);
    }

    return { message: 'ユーザー名を登録しました', isSuccess: true };
    // redirect('/onboarding');
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage, isSuccess: false };
  }
}

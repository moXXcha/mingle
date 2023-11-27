import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { createAvatar } from '../repository/avatar';
import { insertProfile, selectProfileByUserName } from '../repository/profile';
import { getUserByUserId } from './user';

export async function createProfile(
  displayName: string,
  overview: string,
  avatar: File,
) {
  console.log('createProfile');
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // ユーザーのセッションを取得
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const user = await getUserByUserId(session.session?.user.id as string);

    // Storageにavatarをuploadする
    const url = await createAvatar(avatar, user.userName);
    console.log('url: ', url);

    // プロフィールを作成
    await insertProfile({
      id: user.id,
      displayName,
      overview,
      avatarUrl: url,
    });

    return { message: 'プロフィールを作成しました' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}

export async function getProfileByUserName(userName: string) {
  const result = await selectProfileByUserName(userName);
  return result[0];
}

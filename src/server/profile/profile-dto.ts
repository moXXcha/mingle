import { putImage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import 'server-only';

export async function createProfile(
  displayName: string,
  overview: string,
  avatar: File,
) {
  console.log('createProfile');
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    console.log(avatar);
    // ユーザーのセッションを取得
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    console.log('getSessionのdata: ', session);

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const pathName = `${session.session?.user.id}/avatar`;

    // ! ここで動いていない
    // TODO Storageにavatarをuploadする

    const url = await putImage(avatar, pathName);
    console.log('url: ', url);

    // // プロフィールを作成
    // await db.insert(profiles).values({
    //   id: session.session?.user.id as string,
    //   displayName,
    //   overview,
    //   // avatarUrl: data.path,
    //   avatarUrl: 'tmp: StorageのURLを入れる',
    // });

    return { message: 'プロフィールを作成しました' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}

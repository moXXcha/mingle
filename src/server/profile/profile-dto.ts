import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import 'server-only';

export async function createProfile(
  displayName: string,
  overview: string,
  avatar: Blob,
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

    const uniquePart = `${Date.now()}-${Math.random().toString(36)}`; // タイムスタンプとランダムな文字列
    console.log('uniquePart: ', uniquePart);

    // ! ここで動いていない
    // TODO Storageにavatarをuploadする
    // // avatarをsupabase storageにアップロード
    // const { data, error } = await supabase.storage
    //   .from('avatars')
    //   .upload(`${uniquePart}`, avatar);

    // console.log('data: ', data);
    // console.log('error: ', error);

    // if (error) {
    //   throw new Error(error.message);
    // }

    // if (!data) {
    //   throw new Error('data is null');
    // }

    // console.log('ストレージにuploadした後のdata: ', data);

    // // プロフィールを作成
    // await db.insert(profiles).values({
    //   id: session.session?.user.id as string,
    //   displayName,
    //   overview,
    //   avatarUrl: data.path,
    // });

    return { message: 'プロフィールを作成しました' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '不明なエラーが発生しました';
    return { message: errorMessage };
  }
}

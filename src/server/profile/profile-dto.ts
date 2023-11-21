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
    // ユーザーのセッションを取得
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    // Storageにavatarをuploadする
    const url = await putImage(avatar, `avatars/${session.session?.user.id}`);
    console.log('url: ', url);

    // プロフィールを作成
    await db.insert(profiles).values({
      id: session.session?.user.id as string,
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

import { Failure, Profile, Result, Success } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { uploadUserAvatar } from '../repository/avatar';
import { insertProfile, selectProfileByUserName } from '../repository/profile';
import { getUserByUserId } from './user';

export async function createProfile(
  displayName: string,
  overview: string,
  avatar: File,
): Promise<Result<Profile, Error>> {
  console.log('createProfile');
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // ユーザーのセッションを取得
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);

    const userResult = await getUserByUserId(
      session.session?.user.id as string,
    );
    if (userResult.isFailure()) throw userResult;

    // Storageにavatarをuploadする
    const urlResult = await uploadUserAvatar(avatar, userResult.value.userName);
    if (urlResult.isFailure()) throw urlResult;
    console.log('url: ', urlResult.value);

    // プロフィールを作成
    const insertProfileResult = await insertProfile({
      id: userResult.value.id,
      displayName,
      overview,
      avatarUrl: urlResult.value,
    });
    if (insertProfileResult.isFailure()) throw insertProfileResult;

    return new Success({
      displayName,
      overview,
      avatarUrl: urlResult.value,
    });
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to create profile'),
    );
  }
}

export async function getProfileByUserName(
  userName: string,
): Promise<Result<Profile, Error>> {
  return await selectProfileByUserName(userName);
}

import { Failure, Profile, Result, Success } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { uploadUserAvatar } from '../repository/avatar';
import {
  insertProfile,
  selectProfileByUserName,
  updateProfile,
} from '../repository/profile';
import { getUserByUserId } from './user';

export async function createProfile(
  displayName: string,
  overview: string,
  avatar: File,
): Promise<Result<Profile, Error>> {
  console.log('createProfile: START');
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

    console.log('createProfile: END');

    return new Success({
      displayName,
      overview,
      avatarUrl: urlResult.value,
    });
  } catch (error) {
    console.log('createProfile ERROR: ', error);
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

type EditProfileReq = {
  displayName: string;
  overview: string;
  avatar: File;
};

export async function editProfile(
  editProfileReq: EditProfileReq,
): Promise<Result<string, Error>> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) throw new Error('Failed to get user');

    const userResult = await getUserByUserId(user.id);
    if (userResult.isFailure()) throw userResult;

    let avatarUrl = '';
    if (editProfileReq.avatar.size === 0) {
      // avatarの更新をしない
      // avatarUrlを取得する
      const profileResult = await selectProfileByUserName(
        userResult.value.userName,
      );
      if (profileResult.isFailure()) throw profileResult;
      avatarUrl = profileResult.value.avatarUrl;
    } else {
      // avatarがない場合、ここの関数を呼ばない
      // Storageにavatarをuploadする
      const urlResult = await uploadUserAvatar(
        editProfileReq.avatar,
        userResult.value.userName,
      );
      if (urlResult.isFailure()) throw urlResult;

      avatarUrl = urlResult.value;
    }

    const updateProfileResult = await updateProfile({
      id: user?.id,
      displayName: editProfileReq.displayName,
      overview: editProfileReq.overview,
      avatarUrl,
    });
    if (updateProfileResult.isFailure()) throw updateProfileResult;

    return new Success(updateProfileResult.value);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to update profile'),
    );
  }
}

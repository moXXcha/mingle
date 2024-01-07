import { Failure, Profile, Result, Success } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { AvatarRepository } from '../repository/avatar';
import { ProfileRepository, insertProfile } from '../repository/profile';
import { getUserByUserId } from './user';

export const createProfileService = (
  avatarRepository: AvatarRepository,
  profileRepository: ProfileRepository,
) => {
  return {
    createProfile: async (
      displayName: string,
      overview: string,
      avatarFile: File,
    ): Promise<Result<Profile, Error>> => {
      console.log('createProfile: START');

      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      try {
        // ユーザーのセッションを取得
        const { data: session, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw new Error(sessionError.message);

        // TODO
        const userResult = await getUserByUserId(
          session.session?.user.id as string,
        );
        if (userResult.isFailure()) throw userResult;

        // Storageにavatarをuploadする
        const urlResult = await avatarRepository.uploadUserAvatar(
          avatarFile,
          userResult.value.userName,
        );
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
          error instanceof Error ? error : new Error('createProfile failed'),
        );
      }
    },

    getProfileByUserName: async (
      userName: string,
    ): Promise<Result<Profile, Error>> => {
      return await profileRepository.selectProfileByUserName(userName);
    },

    editProfile: async (
      displayName: string,
      overview: string,
      avatarFile: File,
    ): Promise<Result<string, Error>> => {
      try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // 現在ログインしているユーザーを取得する
        const {
          data: { user },
        } = await supabase.auth.getUser();
        // TODO ここのifの条件式はもっと綺麗に書けそう
        if (!user?.id) throw new Error('Failed to get user');

        const userResult = await getUserByUserId(user.id);
        if (userResult.isFailure()) throw userResult;

        let avatarUrl = '';
        // avatarFileのsizeが0なら更新をしない
        if (avatarFile.size === 0) {
          // avatarUrlを取得する
          const profileResult = await profileRepository.selectProfileByUserName(
            userResult.value.userName,
          );
          // TODO throw profileResultで正しいのか検証する
          if (profileResult.isFailure()) throw profileResult;
          avatarUrl = profileResult.value.avatarUrl;
        } else {
          // avatarを更新する

          // Storageにavatarをuploadする
          const urlResult = await avatarRepository.uploadUserAvatar(
            avatarFile,
            userResult.value.userName,
          );
          if (urlResult.isFailure()) throw urlResult;

          avatarUrl = urlResult.value;
        }

        // プロフィールを更新する
        const updateProfileResult = await profileRepository.updateProfile({
          id: user?.id,
          displayName: displayName,
          overview: overview,
          avatarUrl,
        });
        if (updateProfileResult.isFailure()) throw updateProfileResult;

        return new Success(updateProfileResult.value);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('editProfile failed'),
        );
      }
    },
  };
};

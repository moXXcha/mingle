import { Profile } from '@/types/types';
import { eq } from 'drizzle-orm';
import { profiles, users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';

// userNameを元にプロフィールを取得する
export const getProfileByUserName = async (
  userName: string,
): Promise<Profile> => {
  let profile: Profile = {
    displayName: '',
    overview: '',
    avatarUrl: '',
  };

  try {
    const result = await db
      .select({
        displayName: profiles.displayName,
        overview: profiles.overview,
        avatarUrl: profiles.avatarUrl,
      })
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.id))
      .where(eq(users.userName, userName));

    profile = {
      displayName: result[0].displayName as string,
      overview: result[0].overview as string,
      avatarUrl: result[0].avatarUrl as string,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('プロフィールを取得できませんでした。');
    }
  }

  return profile;
};

// userIdを元にavatarUrlを取得する
export const getAvatarUrlByUserId = async (userId: string): Promise<string> => {
  let avatarUrl = '';

  try {
    const result = await db
      .select({
        avatarUrl: profiles.avatarUrl,
      })
      .from(profiles)
      .where(eq(profiles.id, userId));

    avatarUrl = result[0].avatarUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('アバターを取得できませんでした。');
    }
  }

  return avatarUrl;
};

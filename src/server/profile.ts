import { Profile } from '@/types/types';
import { putImage } from '@/utils/storage';
import { eq } from 'drizzle-orm';
import { profiles, users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';
import { getUserNameByUserId } from './user';

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

    if (result.length > 0) {
      avatarUrl = result[0].avatarUrl;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      // TODO エラーメッセージが適切ではない。
      throw new Error('ERROR: avatarUrlを取得できませんでした。');
    }
  }

  return avatarUrl;
};

// プロフィールを新規作成する
export const createProfile = async ({
  userId,
  displayName,
  overview,
  avatarFile,
}: {
  userId: string;
  displayName: string;
  overview: string;
  avatarFile: File;
}): Promise<void> => {
  try {
    await db.transaction(async (tx) => {
      // userNameを取得する
      const userName = await getUserNameByUserId({
        tx,
        userId,
      });

      // avatarFileをアップロードする
      const avatarUrl = await putImage(avatarFile, `avatar/${userName}`);

      // profileを作成する
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await tx.insert(profiles).values({
        id: userId,
        displayName,
        overview,
        avatarUrl,
      });
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    throw new Error('ERROR: プロフィールを作成できませんでした。');
  }
};

// プロフィールを更新する
// TODO displayName, overview, avatarUrlをOptionalにする
// 引数にない場合、既存の値を使う
export const updateProfile = async ({
  userName,
  displayName,
  overview,
  avatarFile,
}: {
  userName: string;
  displayName: string;
  overview: string;
  avatarFile: File;
}): Promise<void> => {
  try {
    await db.transaction(async (tx) => {
      // userNameが存在するか確認する
      const user = await tx
        .select({
          id: users.id,
          userName: users.userName,
        })
        .from(users)
        .where(eq(users.userName, userName));

      if (user.length === 0) {
        throw new Error('ERROR: userNameが存在しません。');
      }

      // avatarFileの保存
      const avatarUrl = await putImage(avatarFile, `avatar/${userName}`);
      // TODO 古いavatarFileを削除する

      // profileを更新する
      await tx
        .update(profiles)
        .set({
          displayName,
          overview,
          avatarUrl,
        })
        .where(eq(profiles.id, user[0].id));
    });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    throw new Error('ERROR: プロフィールを更新できませんでした。');
  }
};

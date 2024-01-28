import { eq } from 'drizzle-orm';
import { follows, profiles, users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';

type FollowUser = {
  userId: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  followedAt: Date;
};

// UserIDを元にfollow一覧を取得する
export const getFollowListByUserId = async (
  userId: string,
): Promise<FollowUser[]> => {
  let followUsers: FollowUser[] = [];
  try {
    // TOOD 無限スクロール 引数にoffsetとlimitを追加する
    // 一旦、limitで10件取得する
    followUsers = await db
      .select({
        userId: follows.followingUserId,
        userName: users.userName,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        followedAt: follows.createdAt,
      })
      .from(follows)
      .where(eq(follows.userId, userId))
      .limit(10)
      .innerJoin(users, eq(follows.followingUserId, users.id))
      .innerJoin(profiles, eq(follows.followingUserId, profiles.id));
  } catch (error) {
    // TOOD エラーハンドリング
    if (error instanceof Error) {
      console.log(error);
      throw new Error('フォロー一覧を取得できませんでした。');
    }
  }

  return followUsers;
};

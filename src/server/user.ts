import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';

// userIdを元にユーザー名を取得する
export const getUserNameByUserId = async (userId: string): Promise<string> => {
  let userName = '';

  try {
    const result = await db
      .select({ userName: users.userName })
      .from(users)
      .where(eq(users.id, userId));

    userName = result[0].userName;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('ユーザー名を取得できませんでした。');
    }
  }

  return userName;
};

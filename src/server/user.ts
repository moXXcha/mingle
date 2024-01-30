import { Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';

// userIdを元にユーザー名を取得する
export const getUserNameByUserId = async ({
  tx,
  userId,
}: {
  tx?: Transaction;
  userId: string;
}): Promise<string> => {
  let userName = '';

  try {
    // トランザクションが存在する場合はtxを使用し、そうでなければdbを使用
    const query = (tx || db)
      .select({ userName: users.userName })
      .from(users)
      .where(eq(users.id, userId));

    const result = await query;

    if (result.length > 0) {
      userName = result[0].userName;
    } else {
      throw new Error('ユーザーが見つかりませんでした。');
    }
  } catch (error) {
    console.log(error);
    throw new Error('ユーザー名を取得できませんでした。');
  }

  return userName;
};

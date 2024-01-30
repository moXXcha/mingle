import { Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';

// userIdを元にuserNameを取得する
export const getUserNameByUserId = async ({
  tx,
  userId,
}: {
  tx?: Transaction;
  userId: string;
}): Promise<string> => {
  let userName = '';

  try {
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

// userNameを元にuserIdを取得する
export const getUserIdByUserName = async ({
  tx,
  userName,
}: {
  tx?: Transaction;
  userName: string;
}): Promise<string> => {
  try {
    const result = await (tx || db)
      .select({ id: users.id })
      .from(users)
      .where(eq(users.userName, userName));

    if (result.length < 0) {
      throw new Error('ERROR: ユーザーが見つかりませんでした。');
    }

    return result[0].id;
  } catch (error) {
    console.log(error);
    throw new Error('ERROR: ユーザーIDを取得できませんでした。');
  }
};

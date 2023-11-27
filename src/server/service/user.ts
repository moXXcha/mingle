import 'server-only';
import { db } from '../db';
import {
  doesUserExistById,
  doesUserExistByUserName,
  insertUser,
  selectUserByUserId,
} from '../repository/user';

// ユーザーを作成
export async function createUser(
  id: string,
  userName: string,
  email: string,
): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      if (await doesUserExistByUserName(userName, tx)) {
        throw new Error(`ユーザー名 "${userName}" は既に使われています`);
      }

      if (await doesUserExistById(id, tx)) {
        throw new Error(`ユーザーID "${id}" は既に使われています`);
      }

      await insertUser(tx, { id, userName, email });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('不明なエラーが発生しました');
  }
}

// ユーザーを取得する
export async function getUserByUserId(userId: string): Promise<{
  id: string;
  userName: string;
  email: string;
}> {
  return await db.transaction(async (tx) => {
    const result = await selectUserByUserId(tx, userId);
    return result;
  });
}

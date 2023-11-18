import { Transaction } from '@/types/types';
import { users } from 'db/schema';
import { eq } from 'drizzle-orm';
import 'server-only';
import { db } from '../db';

// usersテーブルに同じユーザーネームが存在するかを確認
export async function doesUserNameExist(
  userName: string,
  tx: Transaction,
): Promise<boolean> {
  const existingUser = await tx
    .select({
      userName: users.userName,
    })
    .from(users)
    .where(eq(users.userName, userName));

  // ユーザーが存在すればtrueを返す
  return existingUser.length !== 0;
}

// usersテーブルに同じidが存在するかを確認
export async function doesUserIdExist(
  id: string,
  tx: Transaction,
): Promise<boolean> {
  const existingUser = await tx
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.id, id));

  // ユーザーが存在すればtrueを返す
  return existingUser.length !== 0;
}

// ユーザーを作成
export async function createUser(
  id: string,
  userName: string,
  email: string,
): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      // ユーザーネームが存在するかを確認
      if (await doesUserNameExist(userName, tx)) {
        throw new Error('このユーザー名は既に使われています');
      }

      // ユーザーIDが存在するかを確認
      if (await doesUserIdExist(id, tx)) {
        throw new Error('このユーザーIDは既に使われています');
      }
      // 新しいユーザーを作成
      await tx.insert(users).values({
        id,
        userName,
        email,
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

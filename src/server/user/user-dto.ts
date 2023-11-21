import { Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
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

// ユーザーを取得する
export async function getUserByUserId(userId: string) {
  try {
    const result = await db
      .select({
        id: users.id,
        userName: users.userName,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      throw new Error('ユーザーが見つかりませんでした');
    }

    return result[0];
  } catch (error) {
    console.log(error);
  }
}

import { Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

// 特定のフィールドに一致するユーザーが存在するかを確認
async function doesUserExist(
  column: keyof typeof users.$inferSelect,
  value: string,
  tx: Transaction,
): Promise<boolean> {
  const condition = eq(users[column], value);
  const existingUser = await tx.select().from(users).where(condition);
  return existingUser.length > 0;
}

// これはレイヤーが違う

// ユーザーを作成
export async function createUser(
  id: string,
  userName: string,
  email: string,
): Promise<void> {
  try {
    // INSERTする前に、ユーザー名とユーザーIDが既に使われていないかを確認しているのは
    // 単一責任の原則に従っている？？
    await db.transaction(async (tx) => {
      if (await doesUserExist('userName', userName, tx)) {
        throw new Error(`ユーザー名 "${userName}" は既に使われています`);
      }

      if (await doesUserExist('id', id, tx)) {
        throw new Error(`ユーザーID "${id}" は既に使われています`);
      }

      await tx.insert(users).values({ id, userName, email });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('不明なエラーが発生しました');
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

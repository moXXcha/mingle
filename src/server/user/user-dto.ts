import { users } from 'db/schema';
import { eq } from 'drizzle-orm';
import 'server-only';
import { db } from '../db';

export async function doesUserNameExist(userName: string): Promise<boolean> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.userName, userName));

  // ユーザーが存在すればtrueを返す
  return Boolean(existingUser);
}

export async function createUser(
  id: string,
  userName: string,
  email: string,
): Promise<void> {
  try {
    // ユーザーネームが存在するかを確認
    if (await doesUserNameExist(userName)) {
      throw new Error('このユーザー名は既に使われています');
    }

    // 新しいユーザーを作成
    await db.insert(users).values({
      id,
      userName,
      email,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

import { Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import 'server-only';

// IDに一致するユーザーが存在するかを確認
export async function doesUserExistById(
  id: string,
  tx: Transaction,
): Promise<boolean> {
  const condition = eq(users.id, id);
  const existingUser = await tx.select().from(users).where(condition);
  return existingUser.length > 0;
}

// ユーザー名に一致するユーザーが存在するかを確認
export async function doesUserExistByUserName(
  userName: string,
  tx: Transaction,
): Promise<boolean> {
  const condition = eq(users.userName, userName);
  const existingUser = await tx.select().from(users).where(condition);
  return existingUser.length > 0;
}

// ユーザーを取得する
export async function selectUserByUserId(
  tx: Transaction,
  userId: string,
): Promise<{
  id: string;
  userName: string;
  email: string;
}> {
  const result = await tx
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
}

// ユーザーを作成する
export async function insertUser(
  tx: Transaction,
  {
    id,
    userName,
    email,
  }: {
    id: string;
    userName: string;
    email: string;
  },
): Promise<void> {
  await tx.insert(users).values({ id, userName, email });
}

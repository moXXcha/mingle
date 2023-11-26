import { eq } from 'drizzle-orm';
import { profiles, users } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

export async function selectProfileByUserName(userName: string): Promise<
  {
    displayName: string | null;
    overview: string | null;
    avatarUrl: string | null;
  }[]
> {
  // users.userNameと一致するプロフィールを取得
  const result = await db
    .select({
      displayName: profiles.displayName,
      overview: profiles.overview,
      avatarUrl: profiles.avatarUrl,
    })
    .from(users)
    .leftJoin(profiles, eq(users.id, profiles.id))
    .where(eq(users.userName, userName))
    .limit(1);

  if (result.length === 0) {
    throw new Error('プロフィールが見つかりませんでした');
  }

  console.log('result: ', result);
  return result;
}

export async function insertProfile({
  id,
  displayName,
  overview,
  avatarUrl,
}: {
  id: string;
  displayName: string;
  overview: string;
  avatarUrl: string;
}) {
  await db.insert(profiles).values({
    id,
    displayName,
    overview,
    avatarUrl,
  });
}

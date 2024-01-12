'use server';

import { db } from '@/server/db';
import { createClient } from '@/utils/supabase/server';
import { and, eq, sql } from 'drizzle-orm';
import { follows, users } from 'drizzle/schema';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function followButtonAction(
  userName: string,
): Promise<{ followed: boolean; error: boolean }> {
  console.log('followButtonAction START');

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    return await db.transaction(async (tx) => {
      // フォローするユーザーのIDを取得する
      const followingUser = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.userName, userName));

      // すでにfollowをしているかどうかを確認する
      const alreadyExists = await tx
        .select({ count: sql<number>`cast(count(${follows.id}) as int)` })
        .from(follows)
        .where(
          and(
            eq(follows.userId, user?.id as string),
            eq(follows.followingUserId, followingUser[0].id),
          ),
        );

      console.log(alreadyExists);

      if (alreadyExists[0].count > 0) {
        // followを解除する
        console.log('フォローを解除する');
        await tx
          .delete(follows)
          .where(
            and(
              eq(follows.userId, user?.id as string),
              eq(follows.followingUserId, followingUser[0].id),
            ),
          );

        revalidatePath('/');

        return { followed: false, error: false };
      } else {
        // followをする
        console.log('フォローをする');
        await tx.insert(follows).values({
          userId: user?.id as string,
          followingUserId: followingUser[0].id,
        });

        revalidatePath('/');

        return { followed: true, error: false };
      }
    });

    // console.log(result);
  } catch (error) {
    console.log(error);
    revalidatePath('/');
    return { followed: false, error: true };
  }
}

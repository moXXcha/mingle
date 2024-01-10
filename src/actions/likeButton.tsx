'use server';

import { db } from '@/server/db';
import { createClient } from '@/utils/supabase/server';
import { and, eq, sql } from 'drizzle-orm';
import { likes } from 'drizzle/schema';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function likePostAction(
  postId: string,
): Promise<{ liked: boolean; error: boolean }> {
  // TODO いいねをする
  console.log('likePostAction START');

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    return await db.transaction(async (tx) => {
      // すでにいいねをしているかどうかを確認する
      const AlreadyExists = await tx
        .select({ count: sql<number>`cast(count(${likes.id}) as int)` })
        .from(likes)
        .where(
          and(eq(likes.postId, postId), eq(likes.userId, user?.id as string)),
        );

      console.log(AlreadyExists);

      if (AlreadyExists[0].count > 0) {
        // いいねを解除する
        console.log('いいねを解除する');
        await tx
          .delete(likes)
          .where(
            and(eq(likes.postId, postId), eq(likes.userId, user?.id as string)),
          );

        revalidatePath('/');

        return { liked: false, error: false };
      } else {
        // いいねをする
        console.log('いいねをする');
        await tx.insert(likes).values({
          postId,
          userId: user?.id as string,
        });

        revalidatePath('/');

        return { liked: true, error: false };
      }
    });

    // console.log(result);
  } catch (error) {
    console.log(error);
    revalidatePath('/');
    return { liked: false, error: true };
  }
}

/*
すでにいいねをしていたら、いいねを解除する
*/

import { eq } from 'drizzle-orm';
import { posts, users } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

export const getPostsByUserName = async (userName: string) => {
  try {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        musicFileUrl: posts.musicFileUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(users)
      .leftJoin(posts, eq(users.id, posts.userId))
      .where(eq(users.userName, userName));

    if (result.length === 0) {
      throw new Error('投稿が見つかりませんでした');
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getLikedPostsByUserName = async (userName: string) => {
  //   try {
  //     const result = await db.select().from(posts);
  //   } catch (error) {
  //     console.log(error);
  //   }
};

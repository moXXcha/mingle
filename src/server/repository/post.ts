import { PostDetail, Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { posts, users } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

// 投稿データを取得する共通関数
// userName が指定された場合はそのユーザーに関連する投稿を取得する
export const selectPostsData = async (
  userName?: string,
): Promise<PostDetail[]> => {
  // ユーザーとその投稿、タグ、プロフィールを取得
  const result = await db.query.users.findMany({
    with: {
      posts: {
        with: {
          postTagRelations: {
            with: {
              tag: true,
            },
          },
        },
        // 投稿を作成日時の昇順で取得（新しい投稿を先頭に）
        orderBy: (posts, { asc }) => [asc(posts.createdAt)],
      },
      profile: true,
    },
    where: userName ? eq(users.userName, userName) : undefined,
    limit: 10,
  });

  // 取得したデータを整形
  return result.flatMap((user) =>
    user.posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      tags: post.postTagRelations.map((relation) => relation.tag.name),
      userName: user.userName,
      displayName: user.profile.displayName,
      avatarUrl: user.profile.avatarUrl,
    })),
  );
};

// 全ての投稿を取得する関数
export const selectPosts = async (): Promise<PostDetail[]> => {
  return selectPostsData();
};

// 特定のユーザー名に基づいて投稿を取得する関数
export const selectPostsByUserName = async (
  userName: string,
): Promise<PostDetail[]> => {
  const data = await selectPostsData(userName);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const selectLikedPostsByUserName = async (userName: string) => {
  //   try {
  //     const result = await db.select().from(posts);
  //   } catch (error) {
  //     console.log(error);
  //   }
};

export const insertPost = async (
  tx: Transaction,
  {
    userId,
    title,
    content,
    musicFileUrl,
  }: {
    userId: string;
    title: string;
    content: string;
    musicFileUrl: string;
  },
): Promise<string> => {
  const result = await tx
    .insert(posts)
    .values({
      userId,
      title,
      content,
      musicFileUrl,
    })
    .returning({ id: posts.id });

  console.log('insertPost id: ', result[0].id);

  return result[0].id;
};

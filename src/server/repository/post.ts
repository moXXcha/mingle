import {
  Failure,
  PostDetail,
  PostModel,
  Result,
  Success,
  Transaction,
} from '@/types/types';
import { eq } from 'drizzle-orm';
import { postTagRelation, posts, users } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

// 投稿データを取得する共通関数
// userName が指定された場合はそのユーザーに関連する投稿を取得する
// TODO 関数名を変更する
export const selectPostsData = async (
  userName?: string,
): Promise<Result<PostDetail[], Error>> => {
  try {
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
    const data = result.flatMap((user) =>
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

    return new Success(data);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
};

// 全ての投稿を取得する関数
export const selectPosts = async (): Promise<Result<PostDetail[], Error>> => {
  const result = await selectPostsData();

  if (result.isSuccess()) {
    return new Success(result.value);
  } else {
    return new Failure(result.value);
  }
};

// 特定のユーザー名に基づいて投稿を取得する関数
export const selectPostsByUserName = async (
  userName: string,
): Promise<Result<PostDetail[], Error>> => {
  const result = await selectPostsData(userName);

  if (result.isSuccess()) {
    return new Success(result.value);
  } else {
    return new Failure(result.value);
  }
};

// postId に基づいて投稿を取得する関数
export const selectPostById = async (
  postId: string,
): Promise<Result<PostModel, Error>> => {
  try {
    const result = await db.select().from(posts).where(eq(posts.id, postId));
    console.log('selectPostById result: ', result);

    return new Success(result[0]);
  } catch (error) {
    console.log(error);
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
};

// TODO typeファイルに移動
export type PostData = {
  id: string;
  title: string;
  content: string;
  musicFileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

// postId に基づいて投稿を取得する関数
export const selectPostDataByPostId = async (
  postId: string,
): Promise<Result<PostData[], Error>> => {
  try {
    // postId に基づいて投稿を取得
    // ユーザーとその投稿、タグ、プロフィールを取得
    const result = await db.query.postTagRelation.findFirst({
      with: {
        post: true,
        tag: true,
      },
      where: eq(postTagRelation.postId, postId),
    });

    // 取得したデータを整形
    const data = [
      {
        id: result?.post.id as string,
        title: result?.post.title as string,
        content: result?.post.content as string,
        musicFileUrl: result?.post.musicFileUrl as string,
        createdAt: result?.post.createdAt as Date,
        updatedAt: result?.post.updatedAt as Date,
        tags: [result?.tag.name] as string[],
      },
    ];

    console.log('selectPostDataByPostId data: ', data);

    return new Success(data);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
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
): Promise<Result<string, Error>> => {
  try {
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

    return new Success(result[0].id);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
};

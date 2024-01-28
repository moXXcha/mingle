import 'server-only';
import { db } from './db';
import { desc, eq } from 'drizzle-orm';
import { comments, profiles, users } from 'drizzle/schema';
import { Comment } from '@/types/types';

// postIdを元にコメント一覧を取得する
export const getCommentsByPostId = async (
  postId: string,
): Promise<Comment[]> => {
  let commentList: Comment[] = [];

  try {
    commentList = await db
      .select({
        comment: comments.comment,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
        userName: users.userName,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(eq(comments.postId, postId))
      .innerJoin(users, eq(comments.userId, users.id))
      .innerJoin(profiles, eq(users.id, profiles.id))
      .orderBy(desc(comments.createdAt));
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('コメント一覧を取得できませんでした。');
    }
  }

  return commentList;
};

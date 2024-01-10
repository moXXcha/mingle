import { Comment, Failure, Result, Success } from '@/types/types';
import { desc, eq } from 'drizzle-orm';
import { comments, profiles, users } from 'drizzle/schema';
import { db } from '../db';
import { CommentRepository } from '../repository/comment';

export type CommentService = {
  createComment: ({
    postId,
    userId,
    comment,
  }: {
    postId: string;
    userId: string;
    comment: string;
  }) => Promise<Result<string, Error>>;
  getCommentsByPostId: (postId: string) => void;
};

export const createCommentService = (commentRepository: CommentRepository) => {
  return {
    // コメントを投稿する
    createComment: async ({
      postId,
      userId,
      comment,
    }: {
      postId: string;
      userId: string;
      comment: string;
    }): Promise<Result<string, Error>> => {
      console.log('createComment START');
      console.log('postId: ', postId);
      console.log('userId: ', userId);
      console.log('comment: ', comment);
      try {
        return await db.transaction(async (tx) => {
          const result = await commentRepository.insertComment(tx, {
            postId,
            userId,
            comment,
          });
          console.log(result);
          console.log('createComment END');
          return result;
        });
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('createComment failed'),
        );
      }
    },

    // postIdに基づいてコメントの配列を取得する
    /*
    comments.comment
    profiles.displayName
    profiles.avatarUrl
    users.userName
    */
    // TODO service層にDB操作を書いている もうservice, repository層はいらないのでは？
    getCommentsByPostId: async (
      postId: string,
    ): Promise<Result<Comment[], Error>> => {
      try {
        console.log('getCommentsByPostId START');
        return await db.transaction(async (tx) => {
          const result = await tx
            .select({
              comment: comments.comment,
              displayName: profiles.displayName,
              avatarUrl: profiles.avatarUrl,
              userName: users.userName,
            })
            .from(comments)
            .where(eq(comments.postId, postId))
            .innerJoin(users, eq(comments.userId, users.id))
            .innerJoin(profiles, eq(users.id, profiles.id))
            .orderBy(desc(comments.createdAt));

          console.log(result);
          console.log('getCommentsByPostId END');

          return new Success(result as Comment[]);
        });
      } catch (error) {
        return new Failure(
          error instanceof Error
            ? error
            : new Error('getCommentsByPostId failed'),
        );
      }
    },
  };
};

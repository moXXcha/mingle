import { Failure, Result } from '@/types/types';
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
};

export const createCommentService = (commentRepository: CommentRepository) => {
  return {
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
  };
};

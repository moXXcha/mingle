import { Failure, Result, Success, Transaction } from '@/types/types';
import { comments } from 'drizzle/schema';

export type CommentRepository = {
  insertComment: (
    tx: Transaction,
    {
      postId,
      userId,
      comment,
    }: {
      postId: string;
      userId: string;
      comment: string;
    },
  ) => Promise<Result<string, Error>>;
};

export const createCommentRepository = () => {
  return {
    insertComment: async (
      tx: Transaction,
      {
        postId,
        userId,
        comment,
      }: {
        postId: string;
        userId: string;
        comment: string;
      },
    ): Promise<Result<string, Error>> => {
      try {
        console.log('insertComment START');
        console.log('postId: ', postId);
        console.log('userId: ', userId);
        console.log('comment: ', comment);
        const result = await tx
          .insert(comments)
          .values({
            userId,
            postId,
            comment,
          })
          .returning({ id: comments.id });
        console.log(result);
        console.log('insertComment END');
        return new Success(result[0].id);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('insertComment failed'),
        );
      }
    },
  };
};

/*
コメント投稿
postId どの投稿に対するコメントか
userId 誰がコメントしたか
content コメントの内容
*/

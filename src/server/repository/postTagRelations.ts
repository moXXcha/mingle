import { Failure, Result, Success, Transaction } from '@/types/types';
import { postTagRelation } from 'drizzle/schema';
import 'server-only';

export type PostTagRelationRepository = {
  insertPostTagRelation: (
    tx: Transaction,
    postId: string,
    tagIds: string[],
  ) => Promise<Result<void, Error>>;
};

// ? 集約ができていない為に存在していると思うが、一旦実装する
export const postTagRelationRepository = () => {
  return {
    insertPostTagRelation: async (
      tx: Transaction,
      postId: string,
      tagIds: string[],
    ): Promise<Result<void, Error>> => {
      try {
        await tx.insert(postTagRelation).values(
          tagIds.map((tagId) => ({
            postId,
            tagId,
          })),
        );

        // TODO undefinedを返すのは正しいのか？
        return new Success(undefined);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('Unknown error'),
        );
      }
    },
  };
};

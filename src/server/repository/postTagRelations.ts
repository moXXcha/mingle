import { Failure, Result, Success, Transaction } from '@/types/types';
import { postTagRelation } from 'drizzle/schema';
import 'server-only';

export async function insertPostTagRelation(
  tx: Transaction,
  postId: string,
  tagIds: string[],
): Promise<Result<void, Error>> {
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
}

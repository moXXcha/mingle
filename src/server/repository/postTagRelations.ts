import { Transaction } from '@/types/types';
import { postTagRelation } from 'drizzle/schema';
import 'server-only';

export async function insertPostTagRelation(
  tx: Transaction,
  postId: string,
  tagIds: string[],
): Promise<void> {
  await tx.insert(postTagRelation).values(
    tagIds.map((tagId) => ({
      postId,
      tagId,
    })),
  );
}

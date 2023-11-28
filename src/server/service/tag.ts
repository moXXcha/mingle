import { Failure, Result, Success, Tag, Transaction } from '@/types/types';
import 'server-only';
import { findTagIdByName, insertTag, selectTags } from '../repository/tag';

export async function getTags(): Promise<Result<Tag, Error>> {
  const result = await selectTags();
  if (result.isSuccess()) {
    return result;
  } else {
    return result;
  }
}

// タグを作成または取得する関数
export async function createOrGetTags(
  tx: Transaction,
  tagNames: string[],
): Promise<Result<string[], Error>> {
  try {
    const tagIds = [];

    for (const tagName of tagNames) {
      // タグが存在するか確認
      const existingTagId = await findTagIdByName(tx, tagName);

      if (existingTagId.isSuccess()) {
        // タグが存在する場合はそのIDを追加
        tagIds.push(existingTagId.value);
      } else if (existingTagId.isFailure()) {
        // タグが存在しない場合は新たに作成してIDを追加
        const newTagId = await insertTag(tx, tagName);

        if (newTagId.isFailure()) throw new Error('Failed to insert tag');

        tagIds.push(newTagId.value);
      }
    }

    return new Success(tagIds);
  } catch (error) {
    return new Failure(
      error instanceof Error
        ? error
        : new Error('Failed to create or get tags'),
    );
  }
}

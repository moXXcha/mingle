import { Result, Tag, Transaction } from '@/types/types';
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
): Promise<string[]> {
  const tagIds = [];

  for (const tagName of tagNames) {
    // タグが存在するか確認
    const existingTagId = await findTagIdByName(tx, tagName);

    if (existingTagId !== null) {
      // タグが存在する場合はそのIDを追加
      tagIds.push(existingTagId);
    } else {
      // タグが存在しない場合は新たに作成してIDを追加
      const newTagId = await insertTag(tx, tagName);
      tagIds.push(newTagId);
    }
  }

  return tagIds;
}

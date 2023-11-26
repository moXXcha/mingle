import 'server-only';
import { findTagIdByName, insertTag, selectTags } from '../repository/tag';

export async function getTags() {
  const result = await selectTags();
  return result;
}

// タグを作成または取得する関数
export async function createOrGetTags(tagNames: string[]): Promise<string[]> {
  const tagIds = [];

  for (const tagName of tagNames) {
    // タグが存在するか確認
    const existingTagId = await findTagIdByName(tagName);

    if (existingTagId !== null) {
      // タグが存在する場合はそのIDを追加
      tagIds.push(existingTagId);
    } else {
      // タグが存在しない場合は新たに作成してIDを追加
      const newTagId = await insertTag(tagName);
      tagIds.push(newTagId);
    }
  }

  return tagIds;
}

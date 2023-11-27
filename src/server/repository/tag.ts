import { Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { tags } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

// TODO タグの一覧を取得する
// TODO タグを作成する
// ? 複数のタグを一度に作成する は必要？

// 全てのタグを取得する
export async function selectTags() {
  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(tags)
    .orderBy(tags.createdAt);

  return result;
}

// タグを作成する
// TODO returnは何を返す？
// ? すでに存在するか検証する？？
export async function insertTag(
  tx: Transaction,
  name: string,
): Promise<string> {
  const result = await tx
    .insert(tags)
    .values({ name })
    .returning({ id: tags.id });
  return result[0].id;
}

// タグが存在するか確認し、存在する場合はそのIDを返す
export async function findTagIdByName(
  tx: Transaction,
  name: string,
): Promise<string | null> {
  const result = await tx
    .select({ id: tags.id })
    .from(tags)
    .where(eq(tags.name, name))
    .limit(1);

  // タグが見つかった場合はそのIDを返し、見つからない場合はnullを返す
  return result.length > 0 ? result[0].id : null;
}

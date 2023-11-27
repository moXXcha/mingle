import { Failure, Result, Success, Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { tags } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

type Tag = {
  id: string;
  name: string;
};

// 全てのタグを取得する
export async function selectTags(): Promise<Result<Tag, Error>> {
  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(tags)
      .orderBy(tags.createdAt);

    return new Success({
      id: result[0].id,
      name: result[0].name as string,
    });
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to fetch tags'),
    );
  }
}

// タグを作成する
export async function insertTag(
  tx: Transaction,
  name: string,
): Promise<Result<string, Error>> {
  try {
    const result = await tx
      .insert(tags)
      .values({ name })
      .returning({ id: tags.id });
    return new Success(result[0].id);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to insert tag'),
    );
  }
}

// タグが存在するか確認し、存在する場合はそのIDを返す
export async function findTagIdByName(
  tx: Transaction,
  name: string,
): Promise<Result<string, Error>> {
  try {
    const result = await tx
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.name, name))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Tag not found: ${name}`);
    }

    return new Success(result[0].id);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to find tag'),
    );
  }
}

import { Failure, Result, Success, Tag, Transaction } from '@/types/types';
import { eq } from 'drizzle-orm';
import { tags } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

export type TagRepository = {
  selectTags: () => Promise<Result<Tag[], Error>>;
  insertTag: (tx: Transaction, name: string) => Promise<Result<string, Error>>;
  findTagIdByName: (
    tx: Transaction,
    name: string,
  ) => Promise<Result<string, Error>>;
};

export const createTagRepository = () => {
  return {
    // 全てのタグを取得する
    selectTags: async (): Promise<Result<Tag[], Error>> => {
      try {
        const result = await db
          .select({
            id: tags.id,
            name: tags.name,
          })
          .from(tags)
          .orderBy(tags.createdAt);

        return new Success(
          result.map((tag) => ({
            id: tag.id,
            name: tag.name,
          })),
        );
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('selectTags failed'),
        );
      }
    },

    // タグを作成する
    insertTag: async (
      tx: Transaction,
      name: string,
    ): Promise<Result<string, Error>> => {
      try {
        const result = await tx
          .insert(tags)
          .values({ name })
          .returning({ id: tags.id });
        return new Success(result[0].id);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('insertTag failed'),
        );
      }
    },

    // タグが存在するか確認し、存在する場合はそのIDを返す
    findTagIdByName: async (
      tx: Transaction,
      name: string,
    ): Promise<Result<string, Error>> => {
      try {
        const result = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(eq(tags.name, name))
          .limit(1);

        // TODO エラーを投げるのは正しいのか？
        if (result.length === 0) {
          throw new Error(`Tag not found: ${name}`);
        }

        return new Success(result[0].id);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('findTagIdByName failed'),
        );
      }
    },
  };
};

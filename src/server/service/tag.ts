import { Failure, Result, Success, Tag, Transaction } from '@/types/types';
import 'server-only';
import { TagRepository } from '../repository/tag';

export type TagService = {
  getTags: () => Promise<Result<Tag[], Error>>;
  createOrGetTags: (
    tx: Transaction,
    tagNames: string[],
  ) => Promise<Result<string[], Error>>;
};

export const tagService = (tagRepository: TagRepository) => {
  return {
    // タグの配列を取得
    getTags: async (): Promise<Result<Tag[], Error>> => {
      const result = await tagRepository.selectTags();
      if (result.isSuccess()) {
        return result;
      } else {
        return result;
      }
    },

    // タグを作成または取得する関数
    createOrGetTags: async (
      tx: Transaction,
      tagNames: string[],
    ): Promise<Result<string[], Error>> => {
      try {
        const tagIds = [];

        for (const tagName of tagNames) {
          // タグが存在するか確認
          const existingTagId = await tagRepository.findTagIdByName(
            tx,
            tagName,
          );

          if (existingTagId.isSuccess()) {
            // タグが存在する場合はそのIDを追加
            tagIds.push(existingTagId.value);
          } else if (existingTagId.isFailure()) {
            // タグが存在しない場合は新たに作成してIDを追加
            const newTagId = await tagRepository.insertTag(tx, tagName);

            if (newTagId.isFailure()) throw new Error('insertTag failed');

            tagIds.push(newTagId.value);
          }
        }

        return new Success(tagIds);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('createOrGetTags failed'),
        );
      }
    },
  };
};

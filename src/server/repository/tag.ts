import { tags } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

// TODO タグの一覧を取得する
// TODO タグを作成する
// ? 複数のタグを一度に作成する は必要？

// 全てのタグを取得する
export const getTags = async () => {
  try {
    const result = await db
      .select({
        name: tags.name,
      })
      .from(tags);
    console.log('result: ', result);

    if (result.length === 0) {
      throw new Error('タグが見つかりませんでした');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('不明なエラーが発生しました');
  }
};

// タグを作成する
// TODO returnは何を返す？
// ? すでに存在するか検証する？？
export const createTag = async (name: string) => {
  try {
    const result = await db.insert(tags).values({ name });

    console.log('result: ', result);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('不明なエラーが発生しました');
  }
};

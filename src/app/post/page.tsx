'use server';

import { db } from '@/server/db';
import { tags } from 'drizzle/schema';
import { createPostFormAction } from './action';

export default async function Page() {
  // ! とりあえずタグの入力は一つのみ受け付ける

  const { tags, error } = await getTags();
  console.log(tags);
  const tagError = error;

  return (
    <div>
      <div>タグ</div>
      <div>
        {tagError ? (
          <div>{tagError}</div>
        ) : (
          tags.map((tag) => (
            <div key={tag.id}>
              <div>{tag.name}</div>
            </div>
          ))
        )}
      </div>
      <div>新規投稿</div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form action={createPostFormAction}>
        <label htmlFor="title">
          タイトル
          <input
            className="border"
            type="text"
            id="title"
            name="title"
            required
          />
        </label>
        <label htmlFor="musicFile">
          音声ファイル
          <input
            type="file"
            accept=".mp3"
            id="musicFile"
            name="musicFile"
            required
          />
        </label>
        <label htmlFor="tags">
          タグ
          <input
            className="border"
            type="text"
            id="tags"
            name="tags"
            required
          />
        </label>
        <label htmlFor="content">
          概要
          <textarea
            className="border"
            name="content"
            id="content"
            cols={30}
            rows={10}
            required
          ></textarea>
        </label>

        <button type="submit">submit</button>
      </form>
    </div>
  );
}

type Tag = {
  id: string;
  name: string;
};

// tagを取得する
const getTags = async (): Promise<{ tags: Tag[]; error: string }> => {
  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(tags);
    return { tags: result, error: '' };
  } catch (error) {
    console.log(error);
    return { tags: [], error: 'タグの取得に失敗しました' };
  }
};

/* eslint-disable @typescript-eslint/no-misused-promises */
'use server';

import { getTags } from '@/server/service/tag';
import { createPostFormAction } from './action';

export default async function Page() {
  // ! とりあえずタグの入力は一つのみ受け付ける

  const tagsResult = await getTags();
  if (tagsResult.isFailure()) {
    return <div>タグがありません</div>;
  }
  return (
    <div>
      <div>
        <div>タグ</div>
        {tagsResult.value.map((tag) => (
          <div key={tag.id}>
            <div>{tag.name}</div>
          </div>
        ))}
      </div>
      <div>新規投稿</div>
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

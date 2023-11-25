'use server';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home() {
  // ! 音声ファイルのuploadはformAction???
  return (
    <div>
      <div>新規投稿</div>
      <form action="">
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
        <label htmlFor="music">
          音声ファイル
          <input type="file" accept=".mp3" id="music" name="music" required />
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

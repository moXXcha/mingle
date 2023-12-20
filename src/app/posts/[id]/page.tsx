'use server';

import { getPostById } from '@/server/service/post';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Signup({ params }: { params: { id: string } }) {
  const { id } = params;
  // postIdを使って、データ取得する
  const post = await getPostById(id);
  if (post.isFailure()) {
    return <div>投稿がありません</div>;
  }

  return (
    <div>
      <div>詳細画面</div>
      <div>{id}</div>
      <div>音声データ</div>
      <div>{post.value.title}</div>
      <div>{post.value.createdAt.toISOString()}</div>
      <audio controls src={post.value.musicFileUrl} />
      <div>コメント</div>
    </div>
  );
}

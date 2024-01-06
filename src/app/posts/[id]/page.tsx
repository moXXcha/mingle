'use server';

import { getPostById } from '@/server/service/post';
import { Comments } from './components/Comments';
import { MusicPlayer } from './components/MusicPlayer';

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
      <MusicPlayer postId={id} />

      <hr />
      <div>コメント</div>
      <Comments />
    </div>
  );
}

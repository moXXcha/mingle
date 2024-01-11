'use server';

import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';
import { Comments } from './components/Comments';
import { MusicPlayer } from './components/MusicPlayer';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const postService = createPostService(
    createPostRepository(),
    createUserRepository(),
    createMusicFileRepository(),
    createTagService(createTagRepository()),
    createPostTagRelationRepository(),
  );

  // postIdを使って、データ取得する
  const post = await postService.getPostByPostId(id);
  if (post.isFailure()) {
    return <div>投稿がありません</div>;
  }

  return (
    <div>
      <MusicPlayer postId={id} />

      <hr />
      <Comments postId={id} />
    </div>
  );
}

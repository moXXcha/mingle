'use server';

import { Search } from '@/components/ui/Search';
import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';
import { Suspense } from 'react';
import { Comments } from '../../../components/Comments';
import { MusicPlayerSection } from '../../../components/MusicPlayerSection';

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
    <div className="w-11/12 mx-auto">
      <div className="my-6 ml-auto w-fit">
        <Search />
      </div>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <MusicPlayerSection postId={id} />
        </Suspense>

        <hr />
        <Suspense fallback={<div>Loading...</div>}>
          <Comments postId={id} />
        </Suspense>
      </div>
    </div>
  );
}

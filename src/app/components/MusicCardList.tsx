'use server';

import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';
import Image from 'next/image';
import Link from 'next/link';

export const MusicCardList = async () => {
  const postService = createPostService(
    createPostRepository(),
    createUserRepository(),
    createMusicFileRepository(),
    createTagService(createTagRepository()),
    createPostTagRelationRepository(),
  );

  const postsResult = await postService.getPosts();
  if (postsResult.isFailure()) {
    return <div>投稿がありません</div>;
  }

  return (
    <div>
      {postsResult.value.map((post) => (
        <div key={post.id}>
          <Link className="text-xl" href={`/posts/${post.id}`}>
            タイトル: {post.title}
          </Link>
          <div>概要:{post.content}</div>
          <Link href={`/${post.userName}`}>投稿者名:{post.displayName}</Link>

          <div>タグ:</div>
          {post.tags.map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
          <Image
            src={post.avatarUrl}
            alt="Picture of the author"
            width={500}
            height={500}
            priority={true}
          />
          <hr />
        </div>
      ))}
    </div>
  );
};

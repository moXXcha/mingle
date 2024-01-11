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

export default async function Page({
  params,
}: {
  params: { userName: string };
}) {
  const postService = createPostService(
    createPostRepository(),
    createUserRepository(),
    createMusicFileRepository(),
    createTagService(createTagRepository()),
    createPostTagRelationRepository(),
  );

  const { userName } = params;

  // 自分の投稿を取得
  const postsResult = await postService.getPostsByUserName(userName);
  if (postsResult.isFailure()) {
    return <div>投稿がありません</div>;
  }

  return (
    <div>
      <Link className="border text-blue-500" href={`/${userName}/edit`}>
        編集
      </Link>
      {postsResult.value.map((post) => (
        <div key={post.id}>
          <div>タイトル:{post.title}</div>
          <div>概要:{post.content}</div>
          <div>投稿者名:{post.displayName}</div>

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
}

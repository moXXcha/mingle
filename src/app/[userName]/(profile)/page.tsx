'use server';

import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';
import Image from 'next/image';

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
    <div className="border w-1/2">
      {postsResult.value.map((post) => (
        <div key={post.id} className="m-5 border">
          <div className="flex">
            <div>
              <div className="font-bold text-xl">{post.title}</div>
              <div className="font-bold ">{post.displayName}</div>
              <div>{post.content}</div>

              <div className="flex">
                {post.tags.map((tag) => (
                  <div key={tag} className="mr-5">
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
            <Image
              className="rounded-full w-24 h-24 object-cover"
              src={post.avatarUrl}
              alt="icon"
              width={100}
              height={100}
              priority={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

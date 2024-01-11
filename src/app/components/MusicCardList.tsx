'use server';

import { db } from '@/server/db';
import { Failure, PostDetail, Result, Success } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';

export const MusicCardList = async () => {
  const postsResult = await getPosts();
  if (postsResult.isFailure()) {
    return <div>投稿がありません</div>;
  }

  return (
    <div>
      {postsResult.value.map((post) => (
        <div key={post.id} className="flex border my-5 w-1/2">
          <div>
            <Link className="text-xl font-bold" href={`/posts/${post.id}`}>
              タイトル: {post.title}
            </Link>
            <Link href={`/${post.author.userName}`} className="font-bold block">
              投稿者名:{post.author.displayName}
            </Link>
            <div>概要:{post.content}</div>

            <div className="flex">
              {post.tags.map((tag, index) => (
                <div key={index} className="text-cyan-400 mr-5">
                  #{tag}
                </div>
              ))}
            </div>
          </div>
          <Image
            className="rounded-full w-24 h-24 object-cover"
            src={post.author.avatarUrl}
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

const getPosts = async (): Promise<Result<PostDetail[], Error>> => {
  try {
    // ユーザーとその投稿、タグ、プロフィールを取得
    const result = await db.query.users.findMany({
      with: {
        posts: {
          with: {
            postTagRelations: {
              with: {
                tag: true,
              },
            },
          },
          // 投稿を作成日時の昇順で取得（新しい投稿を先頭に）
          orderBy: (posts, { asc }) => [asc(posts.createdAt)],
        },
        profile: true,
      },
      limit: 10,
    });

    // 取得したデータを整形
    const data: PostDetail[] = result.flatMap((user) =>
      user.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        tags: post.postTagRelations.map((relation) => relation.tag.name),
        author: {
          userName: user.userName,
          displayName: user.profile.displayName,
          avatarUrl: user.profile.avatarUrl,
        },
      })),
    );

    return new Success(data);
  } catch (error) {
    return new Failure(error as Error);
  }
};

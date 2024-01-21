'use server';

import { db } from '@/server/db';
import { Failure, PostDetail, Result, Success } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import Link from 'next/link';
import { Tag } from '@/components/ui/Tag';
import Image from 'next/image';

type Tag = {
  url: string;
  text: string;
};

export default async function Page({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;

  // 自分の投稿を取得
  const postsResult = await getPostsByUserName(userName);
  if (postsResult.isFailure()) {
    return <div>投稿がありません</div>;
  }

  return (
    <div className="w-11/12 mx-auto">
      {postsResult.value.map((post) => (
        <div className="block bg-[#E3DEDA] w-full h-44 rounded-xl pl-6 pt-5 mb-5 relative z-10">
        <Link href={`/posts/${post.id}`} className="bg-slate-800 w-full h-full block absolute top-0 left-0 rounded-xl opacity-0 z-20" />
        <div className="flex">
          <div className="w-56">
            <p className="text-xl font-bold text-[#646767]">
              {post.title}
            </p>
            <p className="text-base font-bold text-[#646767] mb-3">
              {post.author.displayName}
            </p>
            <p className="text-xs text-[#646767]">{post.content}</p>
          </div>
          <div>
            <Link href={`/${post.author.userName}`} className="bg-red-400 block w-20 h-20 rounded-full absolute ml-4 opacity-0 z-30" />
            <img
              src={post.author.avatarUrl}
              className="block w-20 h-20 rounded-full ml-4"
            />
          </div>
        </div>
        <div className="absolute bottom-5 space-x-3 z-30">
          {post.tags.map((tag: Tag) => (
            <Tag href={`/home`} text={`${tag}`} />
          ))}
        </div>
      </div>
      ))}
    </div>
  );
}

const getPostsByUserName = async (
  userName: string,
): Promise<Result<PostDetail[], Error>> => {
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
      where: eq(users.userName, userName),
      limit: 10,
    });

    // 取得したデータを整形
    const data = result.flatMap((user) =>
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

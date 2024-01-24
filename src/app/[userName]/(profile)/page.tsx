'use server';

import { db } from '@/server/db';
import { PostDetail } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import Image from 'next/image';

export default async function Page({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;

  // 自分の投稿を取得
  const posts = await getPostsByUserName(userName);

  if (posts.length === 0) {
    return <div>投稿がありません</div>;
  }
  console.log('posts.length: ', posts.length);

  return (
    <div className="border w-1/2">
      {posts.map((post) => (
        <div key={post.id} className="m-5 border">
          <div className="flex">
            <div>
              <div className="font-bold text-xl">{post.title}</div>
              <div className="font-bold ">{post.author.displayName}</div>
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
              src={post.author.avatarUrl}
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

const getPostsByUserName = async (userName: string): Promise<PostDetail[]> => {
  // todo 一旦limitを10にしているが、後に無限スクロールにする
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
          limit: 10,
        },
        profile: true,
      },
      where: eq(users.userName, userName),
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

    return data;
  } catch (error) {
    console.log(error);
    // todo エラー処理
    return [];
  }
};

'use server';

import { getPostsByUserName } from '@/server/service/post';
import Image from 'next/image';

export default async function Home({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;
  console.log('userName: ', userName);

  // 自分の投稿を取得
  const data = await getPostsByUserName(userName);

  return (
    <div>
      {data?.map((post) => (
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

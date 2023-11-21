'use server';

import { getPostsByUserName } from '@/server/post/post-dto';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;
  console.log('userName: ', userName);

  // 自分の投稿を取得
  const data = await getPostsByUserName(userName);
  console.log('data: ', data);

  return (
    <div>
      {data?.map((post) => (
        <div key={post.id}>
          <div>タイトル:{post.title}</div>
          <div>概要:{post.content}</div>
          <Image
            src={post.musicFileUrl as string}
            alt="Picture of the author"
            width={500}
            height={500}
            priority={true}
          />
        </div>
      ))}
    </div>
  );
}

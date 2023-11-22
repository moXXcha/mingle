'use server';

import { getPosts } from '@/server/post/post-dto';
import Image from 'next/image';

export const MusicCardList = async () => {
  const posts = await getPosts();
  return (
    <div>
      {posts?.map((post) => (
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
};
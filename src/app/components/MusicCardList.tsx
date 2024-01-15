'use server';

import { getPosts, loadMorePost } from '@/actions/loadMorePost';
import { LoadMore } from '@/components/LoadMore';
import Image from 'next/image';
import Link from 'next/link';

export const MusicCardList = async () => {
  const postsResult = await getPosts(0);
  if (postsResult.isFailure()) {
    return <div>投稿がありません</div>;
  }
  // TODO initialOffsetをハードコードしない

  return (
    <div>
      <LoadMore loadMoreAction={loadMorePost} initialOffset={10}>
        {postsResult.value.map((post) => (
          <div key={post.id} className="flex border my-5 w-1/2">
            <div>
              <Link className="text-xl font-bold" href={`/posts/${post.id}`}>
                タイトル: {post.title}
              </Link>
              <Link
                href={`/${post.author.userName}`}
                className="font-bold block"
              >
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
      </LoadMore>
    </div>
  );
};

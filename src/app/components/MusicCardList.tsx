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
    <LoadMore loadMoreAction={loadMorePost} initialOffset={10}>
      <div className="space-y-4 mx-auto">
        {postsResult.value.map((post, index) => (
          <div
            className="bg-[#E3DEDA] w-full h-44 rounded-xl pl-6 pt-5"
            key={index}
          >
            <div className="flex">
              <div className="w-56">
                <p className="text-xl font-bold text-[#646767]">{post.title}</p>
                <Link
                  href={`/${post.author.userName}`}
                  className="text-base font-bold text-[#646767] mb-3"
                >
                  投稿者名:{post.author.displayName}
                </Link>

                <p className="text-xs text-[#646767]">{post.content}</p>
              </div>
              <div>
                <Image
                  className="block w-20 h-20 rounded-full ml-4"
                  src={post.author.avatarUrl}
                  alt="Picture of the author"
                  width={500}
                  height={500}
                  priority={true}
                />
              </div>
            </div>
            <div className="mt-2 space-x-3">
              {/* todo Tagコンポーネントを使う */}
              {post.tags.map((tag, index) => (
                <div key={index} className="text-cyan-400 mr-5">
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LoadMore>
  );
};

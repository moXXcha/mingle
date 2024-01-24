'use server';
import Link from 'next/link';
import profileImage from '../../../public/profImage.png';
import { Tag } from './Tag';
import { getPosts, loadMorePost } from '@/actions/loadMorePost';

type Tag = {
  url: string;
  text: string;
};

type Props = {
  musicName: string;
  userName: string;
  musicDescription: string;
  tags: Tag[];
};

export const MusicCard = async (props: Props) => {
  const postsResult = await getPosts(0);
  if (postsResult.isFailure()) {
    return <div>投稿がありません</div>;
  }
  return (
    <div>
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
};

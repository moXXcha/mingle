'use server';

import { db } from '@/server/db';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm';
import { likes, posts } from 'drizzle/schema';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { LikeButton } from './LikeButton';

type Props = {
  postId: string;
};

export const MusicPlayer = async (props: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO ここにORMを書かない
  // 良いねをしているかどうかを確認する
  const like = await db
    .select({ id: likes.id })
    .from(likes)
    .where(
      and(eq(likes.postId, props.postId), eq(likes.userId, user?.id as string)),
    );
  const isLiked = like.length > 0;
  console.log('isLiked: ', isLiked);

  // 投稿データを取得する
  const post = await getPostData(props.postId);
  if (!post) {
    return <div>投稿がありません</div>;
  }

  return (
    <div>
      <div>{post.title}</div>
      <div>
        <audio controls src={post.musicFileUrl}></audio>
      </div>
      <div>tags</div>
      {post.tags?.map((tag, index) => <div key={index}>{tag}</div>)}
      <hr />
      <div>{post.content}</div>
      <Image
        src={post.avatarUrl as string}
        alt="Picture of the author"
        width={500}
        height={500}
        priority={true}
      />
      <Link href={`/${post.user.userName}`}>{post.user.displayName}</Link>
      <LikeButton postId={props.postId} isLiked={isLiked} />
    </div>
  );
};

const getPostData = async (postId: string) => {
  try {
    const result = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: {
        id: true,
        title: true,
        musicFileUrl: true,
        content: true,
      },
      with: {
        postTagRelations: {
          columns: {},
          with: {
            tag: {
              columns: {
                name: true,
              },
            },
          },
        },
        user: {
          columns: {
            userName: true,
          },
          with: {
            profile: {
              columns: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // データ整形
    const post = {
      id: result?.id,
      title: result?.title,
      musicFileUrl: result?.musicFileUrl,
      tags: result?.postTagRelations.map((postTagRelation) => {
        return postTagRelation.tag.name;
      }),
      content: result?.content,
      avatarUrl: result?.user.profile.avatarUrl,
      user: {
        userName: result?.user.userName,
        displayName: result?.user.profile.displayName,
      },
    };

    return post;
  } catch (error) {
    console.log('投稿データの取得に失敗しました');
    console.log(error);
  }
};

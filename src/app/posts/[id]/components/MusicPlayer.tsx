'use server';

import { db } from '@/server/db';
import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm';
import { likes } from 'drizzle/schema';
import { cookies } from 'next/headers';
import { LikeButton } from './LikeButton';

type Props = {
  postId: string;
};

export const MusicPlayer = async (props: Props) => {
  const postService = createPostService(
    createPostRepository(),
    createUserRepository(),
    createMusicFileRepository(),
    createTagService(createTagRepository()),
    createPostTagRelationRepository(),
  );

  const postResult = await postService.getPostDataByPostId(props.postId);
  if (postResult.isFailure()) {
    return <div>投稿がありません</div>;
  }

  console.log(postResult.value);

  const post = postResult.value[0];

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const like = await db
    .select({ id: likes.id })
    .from(likes)
    .where(
      and(eq(likes.postId, props.postId), eq(likes.userId, user?.id as string)),
    );

  const isLiked = like.length > 0;

  console.log('isLiked: ', isLiked);

  return (
    <div>
      <div>{post.title}</div>
      <div>
        <audio controls src={post.musicFileUrl}></audio>
      </div>
      <div>tags</div>
      {post.tags.map((tag) => (
        <div key={tag}>{tag}</div>
      ))}
      <div>{post.content}</div>
      <div>icon</div>
      <div>userName</div>
      <LikeButton postId={props.postId} isLiked={isLiked} />
    </div>
  );
};

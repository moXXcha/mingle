'use server';

import { createMusicFileRepository } from '@/server/repository/musicFile';
import { createPostRepository } from '@/server/repository/post';
import { createPostTagRelationRepository } from '@/server/repository/postTagRelations';
import { createTagRepository } from '@/server/repository/tag';
import { createUserRepository } from '@/server/repository/user';
import { createPostService } from '@/server/service/post';
import { createTagService } from '@/server/service/tag';

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

  // TODO この関数を作る
  const postResult = await postService.getPostDataByPostId(props.postId);
  if (postResult.isFailure()) {
    return <div>投稿がありません</div>;
  }

  console.log(postResult.value);

  const post = postResult.value[0];

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
      <button>followButton</button>
    </div>
  );
};

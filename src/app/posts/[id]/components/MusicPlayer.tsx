'use server';

import { getPostDetailByPostId } from '@/server/service/post';

type Props = {
  postId: string;
};

export const MusicPlayer = async (props: Props) => {
  const postResult = await getPostDetailByPostId(props.postId);
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

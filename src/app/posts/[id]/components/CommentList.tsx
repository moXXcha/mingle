'use server';

import { createCommentRepository } from '@/server/repository/comment';
import { createCommentService } from '@/server/service/comment';
import Image from 'next/image';

type Props = {
  postId: string;
};

export const CommentList = async (props: Props) => {
  const commentService = createCommentService(createCommentRepository());
  // TODO: postIdを使って、コメント一覧を取得する
  const comments = await commentService.getCommentsByPostId(props.postId);
  if (comments.isFailure()) {
    return <div>コメントがありません</div>;
  }

  return (
    <div>
      <div>コメント一覧</div>
      <div>{props.postId}</div>

      {comments.value.map((comment, index) => (
        <div key={index}>
          <div>{comment.comment}</div>
          <div>{comment.userName}</div>
          <div>{comment.displayName}</div>
          <Image
            src={comment.avatarUrl}
            alt="icon"
            width={200}
            height={200}
            priority={true}
          />
        </div>
      ))}
    </div>
  );
};

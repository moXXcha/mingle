'use server';

import { createCommentRepository } from '@/server/repository/comment';
import { createCommentService } from '@/server/service/comment';
import Image from 'next/image';
import Link from 'next/link';

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
      {comments.value.map((comment, index) => (
        <div key={index} className="flex my-5">
          <Image
            className="rounded-full w-14 h-14 object-cover"
            src={comment.avatarUrl}
            alt="icon"
            width={100}
            height={100}
            priority={true}
          />
          <div>
            <Link href={`/${comment.userName}`} className="font-bold">
              {comment.displayName}
            </Link>
            <div className="border">{comment.comment}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

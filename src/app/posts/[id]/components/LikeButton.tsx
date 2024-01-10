'use client';

import { likePostAction } from '@/actions/likeButton';
import { useOptimistic } from 'react';

type Props = {
  postId: string;
  isLiked: boolean;
};

export const LikeButton = (props: Props) => {
  // 現在いいねしているかを取得する

  // useOptimistic
  const [optimisticLikes, changeOptimisticLikes] = useOptimistic(
    props.isLiked,
    (prev) => !prev,
  );

  return (
    <div>
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          changeOptimisticLikes(props.isLiked);
          await likePostAction(props.postId);
        }}
      >
        Like
      </button>
      <div>いいね数: {optimisticLikes ? 1 : 0}</div>
    </div>
  );
};

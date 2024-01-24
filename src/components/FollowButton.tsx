'use client';

import { followButtonAction } from '@/actions/followButton';
import { useOptimistic, useTransition } from 'react';

type Props = {
  userName: string;
  isFollowing: boolean;
};

export const FollowButton = (props: Props) => {
  const [isPending, startTransition] = useTransition();

  const [optimisticLikes, changeOptimisticLikes] = useOptimistic(
    props.isFollowing,
    (prev) => !prev,
  );

  // TODO フォロー済みだった場合、buttonにカーソルを合わせたら、buttonのテキストが「フォロー解除」になると良いかも

  return (
    <div>
      <button
        onClick={() =>
          startTransition(async () => {
            changeOptimisticLikes(props.isFollowing);
            await followButtonAction(props.userName);
          })
        }
      >
        {isPending ? 'loading...' : optimisticLikes ? 'following' : 'follow'}
      </button>
    </div>
  );
};

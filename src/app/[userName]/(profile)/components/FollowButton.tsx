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
        {isPending ? 'loading...' : 'followed'}
      </button>
      <div>{optimisticLikes ? 'followed' : 'follow'}</div>
    </div>
  );
};

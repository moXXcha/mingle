'use client';

import { followButtonAction } from '@/actions/followButton';
import { useFormState } from 'react-dom';
import { FollowButton } from './FollowButton';

const initialState = {
  followed: false,
  error: false,
};

type Props = {
  displayName: string;
};

export const FollowButtonForm = (props: Props) => {
  const followButtonActionWithUserName = followButtonAction.bind(
    null,
    props.displayName,
  );
  const [state, formAction] = useFormState(
    followButtonActionWithUserName,
    initialState,
  );
  console.log(state)
  return (
    <form action={formAction}>
      <FollowButton userName={props.displayName} isFollowing={true} />
    </form>
  );
};

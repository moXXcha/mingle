'use server';

import { db } from '@/server/db';
import { Failure, Result, Success } from '@/types/types';
import { and, eq } from 'drizzle-orm';
import { follows, profiles, users } from 'drizzle/schema';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './FollowButton';

type Props = {
  userName: string;
};

type TProfile = {
  displayName: string;
  overview: string;
  avatarUrl: string;
};

/*
follow
likeと同じように実装する
follow, un follow
*/

export const Profile = async (props: Props) => {
  const profileResult = await getProfileByUserName(props.userName);

  if (profileResult.isFailure()) {
    return <div>プロフィールがありません</div>;
  }

  // TODO isFollowingを取得する
  // const isFollowing = await getIsFollowing({
  //   loginUserId: '1',
  //   targetUserName: props.userName,
  // });

  return (
    <div>
      <Image
        className="rounded-full w-28 h-28 object-cover"
        src={profileResult.value.avatarUrl}
        alt="icon"
        width={100}
        height={100}
        priority={true}
      />
      <FollowButton userName={props.userName} isFollowing={false} />
      <div className="font-bold">{profileResult.value.displayName}</div>
      <div>概要: {profileResult.value.overview}</div>
      <Link className="border text-blue-500" href={`/${props.userName}/edit`}>
        編集
      </Link>
    </div>
  );
};

const getProfileByUserName = async (
  userName: string,
): Promise<Result<TProfile, Error>> => {
  try {
    const result = await db
      .select({
        displayName: profiles.displayName,
        overview: profiles.overview,
        avatarUrl: profiles.avatarUrl,
      })
      .from(users)
      .innerJoin(profiles, eq(users.id, profiles.id))
      .where(eq(users.userName, userName))
      .limit(1);

    return new Success({
      displayName: result[0].displayName,
      overview: result[0].overview,
      avatarUrl: result[0].avatarUrl,
    });
  } catch (error) {
    console.log(error);
    return new Failure(error as Error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getIsFollowing = async ({
  loginUserId,
  targetUserName,
}: {
  loginUserId: string;
  targetUserName: string;
}) => {
  try {
    const targetUserId = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.userName, targetUserName));
    const result = await db
      .select({ id: follows.id })
      .from(follows)
      .where(
        and(
          eq(follows.userId, loginUserId),
          eq(follows.followingUserId, targetUserId[0].id),
        ),
      );

    console.log('result: ', result);
    return new Success(result);
  } catch (error) {
    console.log(error);
    return new Failure(error as Error);
  }
};

'use server';

import { db } from '@/server/db';
import { Failure, Result, Success } from '@/types/types';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm';
import { follows, profiles, users } from 'drizzle/schema';
import { cookies } from 'next/headers';
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

export const Profile = async (props: Props) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileResult = await getProfileByUserName(props.userName);

  if (profileResult.isFailure()) {
    return <div>プロフィールがありません</div>;
  }

  const isFollowing = await getIsFollowing({
    loggedUserId: user?.id as string,
    targetUserName: props.userName,
  });

  const loggedUserName = await getUserNameByUserId(user?.id as string);

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
      {/* 自分のProfileならFollowButtonを表示しない */}
      {loggedUserName !== props.userName ? (
        <FollowButton userName={props.userName} isFollowing={isFollowing} />
      ) : (
        ''
      )}
      <div className="font-bold">{profileResult.value.displayName}</div>
      <div>概要: {profileResult.value.overview}</div>

      {/* 自分のProfileなら編集ボタンを表示する */}
      {loggedUserName === props.userName ? (
        <Link className="border text-blue-500" href={`/${props.userName}/edit`}>
          編集
        </Link>
      ) : (
        ''
      )}
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

const getIsFollowing = async ({
  loggedUserId,
  targetUserName,
}: {
  loggedUserId: string;
  targetUserName: string;
}): Promise<boolean> => {
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
          eq(follows.userId, loggedUserId),
          eq(follows.followingUserId, targetUserId[0].id),
        ),
      );

    console.log('result: ', result);
    return result.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// userIdを元にuserNameを取得する
const getUserNameByUserId = async (userId: string): Promise<string> => {
  try {
    const result = await db
      .select({ userName: users.userName })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0].userName;
  } catch (error) {
    console.log(error);
    return '';
  }
};

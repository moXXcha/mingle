'use server';

import { db } from '@/server/db';
import { Failure, Result, Success } from '@/types/types';
import { eq } from 'drizzle-orm';
import { profiles, users } from 'drizzle/schema';
import Image from 'next/image';

type Props = {
  userName: string;
};

type TProfile = {
  displayName: string;
  overview: string;
  avatarUrl: string;
};

export const Profile = async (props: Props) => {
  const profileResult = await getProfileByUserName(props.userName);

  if (profileResult.isFailure()) {
    return <div>プロフィールがありません</div>;
  }
  return (
    <div>
      <Image
        className="rounded-full w-24 h-24 object-cover"
        src={profileResult.value.avatarUrl}
        alt="icon"
        width={100}
        height={100}
        priority={true}
      />
      <div className="font-bold">{profileResult.value.displayName}</div>
      <div>概要: {profileResult.value.overview}</div>
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

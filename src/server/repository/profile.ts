import { Failure, Profile, Result, Success } from '@/types/types';
import { eq } from 'drizzle-orm';
import { profiles, users } from 'drizzle/schema';
import 'server-only';
import { db } from '../db';

export type ProfileRepository = {
  selectProfileByUserName: (
    userName: string,
  ) => Promise<Result<Profile, Error>>;
};

export const createProfileRepository = () => {
  return {
    selectProfileByUserName: async (
      userName: string,
    ): Promise<Result<Profile, Error>> => {
      try {
        const result = await db
          .select({
            displayName: profiles.displayName,
            overview: profiles.overview,
            avatarUrl: profiles.avatarUrl,
          })
          .from(users)
          .leftJoin(profiles, eq(users.id, profiles.id))
          .where(eq(users.userName, userName))
          .limit(1);

        if (result.length === 0) {
          throw new Error(`Profile not found for userName: ${userName}`);
        }

        return new Success({
          displayName: result[0].displayName as string,
          overview: result[0].overview as string,
          avatarUrl: result[0].avatarUrl as string,
        });
      } catch (error) {
        return new Failure(
          error instanceof Error
            ? error
            : new Error('selectProfileByUserName failed'),
        );
      }
    },
  };
};

export async function insertProfile({
  id,
  displayName,
  overview,
  avatarUrl,
}: {
  id: string;
  displayName: string;
  overview: string;
  avatarUrl: string;
}): Promise<Result<string, Error>> {
  try {
    const result = await db
      .insert(profiles)
      .values({
        id,
        displayName,
        overview,
        avatarUrl,
      })
      .returning({ id: profiles.id });

    return new Success(result[0].id);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

export async function updateProfile({
  id,
  displayName,
  overview,
  avatarUrl,
}: {
  id: string;
  displayName: string;
  overview: string;
  avatarUrl: string;
}): Promise<Result<string, Error>> {
  try {
    const result = await db
      .update(profiles)
      .set({
        displayName,
        overview,
        avatarUrl,
      })
      .where(eq(profiles.id, id))
      .returning({ id: profiles.id });

    return new Success(result[0].id);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

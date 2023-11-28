import { Failure, Result, User } from '@/types/types';
import 'server-only';
import { db } from '../db';
import {
  doesUserExistById,
  doesUserExistByUserName,
  insertUser,
  selectUserByUserId,
} from '../repository/user';

// ユーザーを作成
export async function createUser(
  id: string,
  userName: string,
  email: string,
): Promise<Result<string, Error>> {
  try {
    return await db.transaction(async (tx) => {
      if ((await doesUserExistByUserName(userName, tx)).isFailure()) {
        throw new Error(`ユーザー名 "${userName}" は既に使われています`);
      }

      if ((await doesUserExistById(id, tx)).isFailure()) {
        throw new Error(`ユーザーID "${id}" は既に使われています`);
      }

      const insertUserResult = await insertUser(tx, { id, userName, email });
      if (insertUserResult.isFailure())
        throw new Error('Failed to insert user');

      return insertUserResult;
    });
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to create user'),
    );
  }
}

// ユーザーを取得する
export async function getUserByUserId(
  userId: string,
): Promise<Result<User, Error>> {
  try {
    return await db.transaction(async (tx) => {
      return await selectUserByUserId(tx, userId);
    });
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Failed to fetch user'),
    );
  }
}

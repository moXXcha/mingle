import { Failure, Result, User } from '@/types/types';
import 'server-only';
import { db } from '../db';
import { UserRepository } from '../repository/user';

export type UserService = {
  createUser: (
    id: string,
    userName: string,
    email: string,
  ) => Promise<Result<string, Error>>;
  getUserByUserId: (userId: string) => Promise<Result<User, Error>>;
};

export const userService = (userRepository: UserRepository) => {
  return {
    // ユーザーを作成
    createUser: async (
      id: string,
      userName: string,
      email: string,
    ): Promise<Result<string, Error>> => {
      try {
        return await db.transaction(async (tx) => {
          if (
            (
              await userRepository.doesUserExistByUserName(userName, tx)
            ).isFailure()
          ) {
            throw new Error(`ユーザー名 "${userName}" は既に使われています`);
          }

          if ((await userRepository.doesUserExistById(id, tx)).isFailure()) {
            throw new Error(`ユーザーID "${id}" は既に使われています`);
          }

          const insertUserResult = await userRepository.insertUser(tx, {
            id,
            userName,
            email,
          });
          if (insertUserResult.isFailure())
            throw new Error('insertUser failed');

          return insertUserResult;
        });
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('createUser failed'),
        );
      }
    },

    // ユーザーを取得する
    // TODO いらなくね
    getUserByUserId: async (userId: string): Promise<Result<User, Error>> => {
      try {
        return await db.transaction(async (tx) => {
          return await userRepository.selectUserByUserId(tx, userId);
        });
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('getUserByUserId failed'),
        );
      }
    },
  };
};

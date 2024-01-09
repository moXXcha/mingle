import { Failure, Result, Success, Transaction, User } from '@/types/types';
import { eq } from 'drizzle-orm';
import { users } from 'drizzle/schema';
import 'server-only';

export type UserRepository = {
  doesUserExistById: (
    id: string,
    tx: Transaction,
  ) => Promise<Result<boolean, Error>>;
  doesUserExistByUserName: (
    userName: string,
    tx: Transaction,
  ) => Promise<Result<boolean, Error>>;
  selectUserByUserId: (
    tx: Transaction,
    userId: string,
  ) => Promise<Result<User, Error>>;
  insertUser: (
    tx: Transaction,
    { id, userName, email }: { id: string; userName: string; email: string },
  ) => Promise<Result<string, Error>>;
};

export const userRepository = () => {
  return {
    // IDに一致するユーザーが存在するかを確認
    doesUserExistById: async (
      id: string,
      tx: Transaction,
    ): Promise<Result<boolean, Error>> => {
      try {
        const condition = eq(users.id, id);
        const existingUser = await tx.select().from(users).where(condition);
        return new Success(existingUser.length > 0);
      } catch (error) {
        return new Failure(
          error instanceof Error
            ? error
            : new Error('doesUserExistById failed'),
        );
      }
    },

    // ユーザー名に一致するユーザーが存在するかを確認
    doesUserExistByUserName: async (
      userName: string,
      tx: Transaction,
    ): Promise<Result<boolean, Error>> => {
      try {
        const condition = eq(users.userName, userName);
        const existingUser = await tx.select().from(users).where(condition);
        return new Success(existingUser.length > 0);
      } catch (error) {
        return new Failure(
          error instanceof Error
            ? error
            : new Error('doesUserExistByUserName failed'),
        );
      }
    },

    // ユーザーIDを元にユーザーを取得する
    selectUserByUserId: async (
      tx: Transaction,
      userId: string,
    ): Promise<Result<User, Error>> => {
      try {
        const result = await tx
          .select({
            id: users.id,
            userName: users.userName,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, userId));

        if (result.length === 0) {
          throw new Error('ユーザーが見つかりませんでした');
        }

        return new Success({
          id: result[0].id,
          userName: result[0].userName,
          email: result[0].email,
        });
      } catch (error) {
        return new Failure(
          error instanceof Error
            ? error
            : new Error('selectUserByUserId failed'),
        );
      }
    },

    // ユーザーを作成する
    insertUser: async (
      tx: Transaction,
      {
        id,
        userName,
        email,
      }: {
        id: string;
        userName: string;
        email: string;
      },
    ): Promise<Result<string, Error>> => {
      try {
        const result = await tx
          .insert(users)
          .values({ id, userName, email })
          .returning({ id: users.id });
        return new Success(result[0].id);
      } catch (error) {
        return new Failure(
          error instanceof Error ? error : new Error('insertUser failed'),
        );
      }
    },
  };
};

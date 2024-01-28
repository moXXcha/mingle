import { ExtractTablesWithRelations, InferSelectModel } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { z } from 'zod';
import {
  posts,
  profiles,
  tags,
  users,
} from '/Users/kou12345/workspace/mingle-web/drizzle/schema';

export type Result<T, E> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  constructor(readonly value: T) {}
  type = 'success' as const;
  isSuccess(): this is Success<T, E> {
    return true;
  }
  isFailure(): this is Failure<T, E> {
    return false;
  }
}

export class Failure<T, E> {
  constructor(readonly value: E) {}
  type = 'failure' as const;
  isSuccess(): this is Success<T, E> {
    return false;
  }
  isFailure(): this is Failure<T, E> {
    return true;
  }
}

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
});

export type Auth = z.infer<typeof AuthSchema>;

export type Transaction = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import('/Users/kou12345/workspace/mingle-web/drizzle/schema'),
  ExtractTablesWithRelations<
    typeof import('/Users/kou12345/workspace/mingle-web/drizzle/schema')
  >
>;

// ユーザーを作成
export const CreatePostSchema = z.object({
  userId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  musicFileUrl: z.string().url(),
  tags: z.array(z.string()),
});

export type CreatePost = z.infer<typeof CreatePostSchema>;

export type PostModel = InferSelectModel<typeof posts>;
export type TagModel = InferSelectModel<typeof tags>;
export type UserModel = InferSelectModel<typeof users>;
export type ProfileModel = InferSelectModel<typeof profiles>;

export type PostData = {
  id: string;
  title: string;
  content: string;
  musicFileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

export type PostDetail = {
  id: PostModel['id'];
  title: PostModel['title'];
  content: PostModel['content'];
  createdAt: PostModel['createdAt'];
  updatedAt: PostModel['updatedAt'];
  tags: TagModel['name'][];
  author: {
    userName: UserModel['userName'];
    displayName: ProfileModel['displayName'];
    avatarUrl: ProfileModel['avatarUrl'];
  };
};

export type Tag = {
  id: string;
  name: string;
};

export type Profile = {
  displayName: string;
  overview: string;
  avatarUrl: string;
};

export type User = {
  id: string;
  userName: string;
  email: string;
};

export type Comment = {
  comment: string;
  displayName: string;
  avatarUrl: string;
  userName: string;
  createdAt: Date;
};

export type formActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

export type State = {
  message: string | null;
};

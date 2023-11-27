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

export type PostDetail = {
  id: PostModel['id'];
  title: PostModel['title'];
  content: PostModel['content'];
  createdAt: PostModel['createdAt'];
  updatedAt: PostModel['updatedAt'];
  tags: TagModel['name'][];
  userName: UserModel['userName'];
  displayName: ProfileModel['displayName'];
  avatarUrl: ProfileModel['avatarUrl'];
};

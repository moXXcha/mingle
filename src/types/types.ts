import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { z } from 'zod';

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
export const CreatePost = z.object({
  userId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  musicFileUrl: z.string().url(),
  tags: z.array(z.string().uuid()),
});

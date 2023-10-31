import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL as string,
    // connectionString:
    //   "postgresql://postgres:lAYK1RGoFDzYq5mZ@db.fevzlrlkxizwlmxsqxer.supabase.co:5432/postgres",
  },
} satisfies Config;

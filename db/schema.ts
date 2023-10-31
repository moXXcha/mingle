import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey(),
  userName: text("user_name").notNull().unique(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  musicFileUrl: text("music_file_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").notNull().primaryKey(),
  displayName: text("display_name").notNull(),
  overview: text("overview").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const postTagRelation = pgTable("post_tag_relations", {
  postId: uuid("post_id").notNull().primaryKey(),
  tagId: uuid("tag_id").notNull().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  postId: uuid("post_id").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const follows = pgTable("follows", {
  id: uuid("id").notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  followingUserId: uuid("following_user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const likes = pgTable("likes", {
  id: uuid("id").notNull().primaryKey(),
  postId: uuid("post_id").notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

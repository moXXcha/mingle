import { PostDetail } from '@/types/types';
import 'server-only';
import { db } from '../db';
import { uploadMusicFile } from '../repository/musicFile';
import {
  insertPost,
  selectPosts,
  selectPostsByUserName,
} from '../repository/post';
import { insertPostTagRelation } from '../repository/postTagRelations';
import { selectUserByUserId } from '../repository/user';
import { createOrGetTags } from './tag';

export async function getPostsByUserName(
  userName: string,
): Promise<PostDetail[]> {
  const result = await selectPostsByUserName(userName);
  return result;
}

export async function getPosts(): Promise<PostDetail[]> {
  const result = await selectPosts();
  return result;
}

export async function createPost({
  userId,
  title,
  content,
  musicFile,
  tags,
}: {
  userId: string;
  title: string;
  content: string;
  musicFile: File;
  tags: string[];
}): Promise<string | void> {
  // トランザクション開始
  return await db
    .transaction(async (tx) => {
      // ユーザー存在確認
      const user = await selectUserByUserId(tx, userId);
      if (!user) {
        throw new Error('User not found');
      }

      // 音声ファイルのアップロード
      const musicFileUrl = await uploadMusicFile(
        musicFile,
        title,
        user.userName,
      );

      // タグの処理
      const tagIds = await createOrGetTags(tx, tags);

      // 投稿の作成
      const newPostId = await insertPost(tx, {
        userId,
        title,
        content,
        musicFileUrl,
      });

      console.log('createPost: newPostId: ', newPostId);

      // 投稿とタグの関連付け
      await insertPostTagRelation(tx, newPostId, tagIds);

      console.log('hoge: ', newPostId);

      // ! ここでreturnできていない？
      // 新しい投稿のIDを返す
      return newPostId;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
    });
}

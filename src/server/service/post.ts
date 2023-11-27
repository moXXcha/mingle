import { Failure, PostDetail, Result } from '@/types/types';
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
): Promise<Result<PostDetail[], Error>> {
  const result = await selectPostsByUserName(userName);
  if (result.isSuccess()) {
    return result;
  } else {
    return result;
  }
}

export async function getPosts(): Promise<Result<PostDetail[], Error>> {
  const result = await selectPosts();
  if (result.isSuccess()) {
    return result;
  } else {
    return result;
  }
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
}): Promise<Result<string, Error>> {
  try {
    // トランザクション開始
    return await db.transaction(async (tx) => {
      // ユーザー存在確認
      const user = await selectUserByUserId(tx, userId);
      if (user.isFailure()) {
        throw new Error('ユーザーが見つかりませんでした');
      }

      // 音声ファイルのアップロード
      const musicFileUrl = await uploadMusicFile(
        musicFile,
        title,
        user.value.userName,
      );

      if (musicFileUrl.isFailure()) {
        throw new Error('音声ファイルのアップロードに失敗しました');
      }

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
    });
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

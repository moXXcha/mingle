import { Failure, PostDetail, PostModel, Result, Success } from '@/types/types';
import 'server-only';
import { db } from '../db';
import { uploadMusicFile } from '../repository/musicFile';
import {
  PostData,
  insertPost,
  selectPostById,
  selectPostDataByPostId,
  selectPosts,
  selectPostsByUserName,
} from '../repository/post';
import { insertPostTagRelation } from '../repository/postTagRelations';
import { selectUserByUserId } from '../repository/user';
import { createOrGetTags } from './tag';

export async function getPostsByUserName(
  userName: string,
): Promise<Result<PostDetail[], Error>> {
  return await selectPostsByUserName(userName);
}

export async function getPostById(
  postId: string,
): Promise<Result<PostModel, Error>> {
  const postsResult = await selectPostById(postId);

  if (postsResult.isFailure()) return postsResult;

  return new Success(postsResult.value);
}

export async function getPosts(): Promise<Result<PostDetail[], Error>> {
  return await selectPosts();
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
      const userResult = await selectUserByUserId(tx, userId);
      if (userResult.isFailure()) return userResult;

      // 音声ファイルのアップロード
      const musicFileUrlResult = await uploadMusicFile(
        musicFile,
        title,
        userResult.value.userName,
      );
      if (musicFileUrlResult.isFailure()) return musicFileUrlResult;

      // タグの処理
      const tagIdsResult = await createOrGetTags(tx, tags);
      if (tagIdsResult.isFailure()) return tagIdsResult;

      // 投稿の作成
      const newPostIdResult = await insertPost(tx, {
        userId,
        title,
        content,
        musicFileUrl: musicFileUrlResult.value,
      });
      if (newPostIdResult.isFailure()) return newPostIdResult;
      console.log('createPost: newPostId: ', newPostIdResult.value);

      // 投稿とタグの関連付け
      const postTagRelationResult = await insertPostTagRelation(
        tx,
        newPostIdResult.value,
        tagIdsResult.value,
      );
      if (postTagRelationResult.isFailure()) return postTagRelationResult;

      // 新しい投稿のIDを返す
      return new Success(newPostIdResult.value);
    });
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

export async function getPostDetailByPostId(
  postId: string,
): Promise<Result<PostData[], Error>> {
  /*
    title
    content
    musicFileUrl
    tags
    userName
    userIconUrl
    を取得する
  */
  try {
    const postDetailResult = await selectPostDataByPostId(postId);
    if (postDetailResult.isFailure()) return postDetailResult;
    console.log('getPostDetailByPostId: ', postDetailResult.value);

    return new Success(postDetailResult.value);
  } catch (error) {
    return new Failure(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

import {
  Failure,
  PostData,
  PostDetail,
  PostModel,
  Result,
  Success,
} from '@/types/types';
import 'server-only';
import { db } from '../db';
import { MusicFileRepository } from '../repository/musicFile';
import { PostRepository } from '../repository/post';
import { PostTagRelationRepository } from '../repository/postTagRelations';
import { UserRepository } from '../repository/user';
import { TagService } from './tag';

export type PostService = {
  getPostsByUserName: (
    userName: string,
  ) => Promise<Result<PostDetail[], Error>>;
  // TODO 関数名要修正
  getPostByPostId: (postId: string) => Promise<Result<PostModel, Error>>;
  getPostDataByPostId: (postId: string) => Promise<Result<PostData[], Error>>;
  getPostDetailByPostId: (postId: string) => Promise<Result<PostDetail, Error>>;
  getPosts: () => Promise<Result<PostDetail[], Error>>;
  createPost: ({
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
  }) => Promise<Result<string, Error>>;
};

export const createPostService = (
  postRepository: PostRepository,
  userRepository: UserRepository,
  musicFileRepository: MusicFileRepository,
  tagService: TagService,
  postTagRelationRepository: PostTagRelationRepository,
) => {
  return {
    // 特定のユーザー名の投稿の配列を取得
    getPostsByUserName: async (
      userName: string,
    ): Promise<Result<PostDetail[], Error>> => {
      return await postRepository.selectPostsByUserName(userName);
    },

    // postIdを元に投稿を取得
    getPostByPostId: async (
      postId: string,
    ): Promise<Result<PostModel, Error>> => {
      const postsResult = await postRepository.selectPostById(postId);

      if (postsResult.isFailure()) return postsResult;

      return new Success(postsResult.value);
    },

    getPostDataByPostId: async (
      postId: string,
    ): Promise<Result<PostData[], Error>> => {
      return await postRepository.selectPostDataByPostId(postId);
    },

    // postIdを元に投稿の詳細を取得
    getPostDetailByPostId: async (
      postId: string,
    ): Promise<Result<PostDetail, Error>> => {
      const postsResult = await postRepository.selectPostDetailByPostId(postId);

      if (postsResult.isFailure()) return postsResult;

      return new Success(postsResult.value[0]);
    },

    // 投稿の配列を取得
    getPosts: async (): Promise<Result<PostDetail[], Error>> => {
      return await postRepository.selectPosts();
    },

    // 投稿を作成
    createPost: async ({
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
    }): Promise<Result<string, Error>> => {
      try {
        // トランザクション開始
        return await db.transaction(async (tx) => {
          // ユーザー存在確認
          const userResult = await userRepository.selectUserByUserId(
            tx,
            userId,
          );
          if (userResult.isFailure()) return userResult;

          // 音声ファイルのアップロード
          const musicFileUrlResult = await musicFileRepository.uploadMusicFile(
            musicFile,
            title,
            userResult.value.userName,
          );
          if (musicFileUrlResult.isFailure()) return musicFileUrlResult;

          // タグの処理
          const tagIdsResult = await tagService.createOrGetTags(tx, tags);
          if (tagIdsResult.isFailure()) return tagIdsResult;

          // 投稿の作成
          const newPostIdResult = await postRepository.insertPost(tx, {
            userId,
            title,
            content,
            musicFileUrl: musicFileUrlResult.value,
          });
          if (newPostIdResult.isFailure()) return newPostIdResult;
          console.log('createPost: newPostId: ', newPostIdResult.value);

          // 投稿とタグの関連付け
          // TODO これは集約ができていないよな
          const postTagRelationResult =
            await postTagRelationRepository.insertPostTagRelation(
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
          error instanceof Error ? error : new Error('createPost failed'),
        );
      }
    },
  };
};

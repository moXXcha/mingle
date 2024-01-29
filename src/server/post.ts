import { PostDetail } from '@/types/types';
import { eq } from 'drizzle-orm';
import { posts, users } from 'drizzle/schema';
import 'server-only';
import { db } from './db';

// userNameを元に投稿一覧を取得する
export const getPostsByUserName = async (
  userName: string,
): Promise<PostDetail[]> => {
  let posts: PostDetail[] = [];
  // todo 一旦limitを10にしているが、後に無限スクロールにする
  try {
    const result = await db.query.users.findMany({
      with: {
        posts: {
          with: {
            postTagRelations: {
              with: {
                tag: true,
              },
            },
          },
          // 投稿を作成日時の昇順で取得（新しい投稿を先頭に）
          orderBy: (posts, { asc }) => [asc(posts.createdAt)],
          limit: 10,
        },
        profile: true,
      },
      where: eq(users.userName, userName),
    });

    // 取得したデータを整形
    posts = result.flatMap((user) =>
      user.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        tags: post.postTagRelations.map((relation) => relation.tag.name),
        author: {
          userName: user.userName,
          displayName: user.profile.displayName,
          avatarUrl: user.profile.avatarUrl,
        },
      })),
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('投稿一覧を取得できませんでした。');
    }
  }

  return posts;
};

// postIdを元に投稿を取得する
export const getPostById = async (postId: string): Promise<PostDetail> => {
  let post: PostDetail = {
    id: '',
    title: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    author: {
      userName: '',
      displayName: '',
      avatarUrl: '',
    },
  };

  try {
    const result = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: {
        id: true,
        title: true,
        musicFileUrl: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        postTagRelations: {
          columns: {},
          with: {
            tag: {
              columns: {
                name: true,
              },
            },
          },
        },
        user: {
          columns: {
            userName: true,
          },
          with: {
            profile: {
              columns: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new Error('投稿が見つかりませんでした。');
    }

    post = {
      id: result.id,
      title: result.title,
      content: result.content,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      tags: result.postTagRelations.map((postTagRelation) => {
        return postTagRelation.tag.name;
      }),
      author: {
        userName: result.user.userName,
        displayName: result.user.profile.displayName,
        avatarUrl: result.user.profile.avatarUrl,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      throw new Error('投稿を取得できませんでした。');
    }
  }

  return post;
};

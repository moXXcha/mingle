import { PostDetail } from '@/types/types';
import 'server-only';
import { selectPosts, selectPostsByUserName } from '../repository/post';

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

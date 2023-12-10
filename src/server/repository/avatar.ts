import { Failure, Result, Success } from '@/types/types';
import { putImage } from '@/utils/storage';
import 'server-only';

export async function uploadUserAvatar(
  avatar: File,
  userName: string,
): Promise<Result<string, Error>> {
  // ファイル名の生成
  const fileName = `avatars/${encodeURIComponent(userName)}`;
  const result = await putImage(avatar, fileName);

  if (result.isSuccess()) {
    return new Success(result.value);
  } else {
    return new Failure(result.value);
  }
}

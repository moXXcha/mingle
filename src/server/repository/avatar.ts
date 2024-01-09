import { Failure, Result, Success } from '@/types/types';
import { putImage } from '@/utils/storage';
import 'server-only';

export type AvatarRepository = {
  uploadUserAvatar: (
    avatarFile: File,
    userName: string,
  ) => Promise<Result<string, Error>>;
};

export const createAvatarRepository = () => {
  return {
    uploadUserAvatar: async (
      avatarFile: File,
      userName: string,
    ): Promise<Result<string, Error>> => {
      // ファイル名の作成
      const fileName = `avatars/${encodeURIComponent(userName)}`;

      // ファイルのアップロード
      const result = await putImage(avatarFile, fileName);

      if (result.isSuccess()) {
        return new Success(result.value);
      } else {
        return new Failure(result.value);
      }
    },
  };
};

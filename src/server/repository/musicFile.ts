import { Failure, Result, Success } from '@/types/types';
import { putAudio } from '@/utils/storage';
import 'server-only';

export type MusicFileRepository = {
  uploadMusicFile: (
    musicFile: File,
    title: string,
    userName: string,
  ) => Promise<Result<string, Error>>;
};

export const createMusicFileRepository = () => {
  return {
    uploadMusicFile: async (
      musicFile: File,
      title: string,
      userName: string,
    ): Promise<Result<string, Error>> => {
      // ファイル名を作成
      const pathName = `/music/${encodeURIComponent(
        title,
      )}_${encodeURIComponent(userName)}_${Date.now()}.mp3`;

      // ファイルのアップロード
      const result = await putAudio(musicFile, pathName);

      if (result.isSuccess()) {
        return new Success(result.value);
      } else {
        return new Failure(result.value);
      }
    },
  };
};

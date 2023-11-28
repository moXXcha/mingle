import { Failure, Result, Success } from '@/types/types';
import { putAudio } from '@/utils/storage';
import 'server-only';

export async function uploadMusicFile(
  musicFile: File,
  title: string,
  userName: string,
): Promise<Result<string, Error>> {
  // ファイル名を生成
  const pathName = `/music/${encodeURIComponent(title)}_${encodeURIComponent(
    userName,
  )}_${Date.now()}.mp3`;

  // putAudioを呼び出し、結果を処理
  const result = await putAudio(musicFile, pathName);

  if (result.isSuccess()) {
    return new Success(result.value);
  } else {
    return new Failure(result.value);
  }
}

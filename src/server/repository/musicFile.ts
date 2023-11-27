import { putAudio } from '@/utils/storage';
import 'server-only';

export async function uploadMusicFile(
  musicFile: File,
  title: string,
  userName: string,
) {
  const url = await putAudio(
    musicFile,
    `/music/${title}_${userName}_${Date.now()}.mp3`,
  );
  return url;
}

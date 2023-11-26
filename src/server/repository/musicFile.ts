import { putImage } from '@/utils/storage';
import 'server-only';

export async function uploadMusicFile(
  musicFile: File,
  title: string,
  userName: string,
) {
  // /music/{title}_{userName}-{timestamp}.mp3
  const pathName = `/music/${title}_${userName}-${Date.now()}.mp3`;
  const url = await putImage(musicFile, pathName);
  return url;
}

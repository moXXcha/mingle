import { putImage } from '@/utils/storage';
import 'server-only';

// ! これはサービスでは？ utils/storage.tsがリポジトリ層の役割では？
export async function createAvatar(
  avatar: File,
  userName: string,
): Promise<string> {
  const url = await putImage(
    avatar,
    `avatars/${userName}_${new Date().toISOString()}`,
  );
  return url;
}

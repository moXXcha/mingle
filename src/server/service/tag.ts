import 'server-only';
import { selectTags } from '../repository/tag';

export async function getTags() {
  const result = await selectTags();
  return result;
}

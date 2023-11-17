import { users } from 'db/schema';
import 'server-only';
import { db } from '../db';

export async function createUser(id: string, userName: string, email: string) {
  try {
    const result = await db.insert(users).values({
      id,
      userName,
      email,
    });

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

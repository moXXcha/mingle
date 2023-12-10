'use server';

import { MusicCardList } from './components/MusicCardList';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Page() {
  return (
    <div>
      <form action="api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>

      <div>
        <MusicCardList />
      </div>
    </div>
  );
}

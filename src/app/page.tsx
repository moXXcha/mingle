'use server';

import { Suspense } from 'react';
import { MusicCardList } from './components/MusicCardList';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Page() {
  return (
    <div>
      <form action="api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <MusicCardList />
        </Suspense>
      </div>
    </div>
  );
}

// TODO Loading用のスケルトンを作る

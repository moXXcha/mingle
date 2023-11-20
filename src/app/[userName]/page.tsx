'use server';

import { Profile } from './components/Profile';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home({
  params,
}: {
  params: { userName: string };
}) {
  const { userName } = params;

  console.log('userName: ', userName);

  return (
    <div>
      <h1>Page for user {userName}</h1>
      <Profile />
    </div>
  );
}

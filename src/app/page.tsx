'use server';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Home() {
  return (
    <div>
      <form action="api/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}

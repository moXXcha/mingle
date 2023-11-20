'use server';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Login() {
  return (
    <form method="post" action="api/auth/login">
      Email
      <input type="text" name="email" required />
      Password
      <input type="password" name="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}

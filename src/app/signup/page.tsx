'use server';

// eslint-disable-next-line @typescript-eslint/require-await
export default async function Signup() {
  return (
    <form action="/api/auth/signup" method="post">
      <label htmlFor="email">
        Email: <input name="email" required className="border" />
      </label>
      <label htmlFor="password">
        Password:
        <input type="password" name="password" required className="border" />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

'use server';

export default async function Signup() {
  return (
    <form action="/auth/sign-up" method="post">
      <label htmlFor="email">
        <input name="email" required />
      </label>
      <label htmlFor="password">
        <input type="password" name="password" required />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

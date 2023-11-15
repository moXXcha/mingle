export default function Login() {
  return (
    <form method="post" action="api/auth/login">
      <label htmlFor="email">
        <input name="email" required />
      </label>
      <label htmlFor="password">
        <input type="password" name="password" required />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
}

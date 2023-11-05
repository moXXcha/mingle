export default function Login() {
  return (
    <form action="/auth/login" method="post">
      <label htmlFor="email">Email</label>
      <input name="email" required />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" required />
      <button>Sign In</button>
    </form>
  );
}

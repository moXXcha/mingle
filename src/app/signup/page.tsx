export default function Signup() {
  return (
    <form action="/auth/sign-up" method="post">
      <label htmlFor="email">Email</label>
      <input name="email" required />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" required />
      <button>Sign Up</button>
    </form>
  );
}

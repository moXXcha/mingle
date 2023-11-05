export default function Signup() {
  return (
    <form action="/auth/sign-up" method="post">
      <label htmlFor="email">Email</label>
      <input name="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" />
      <button>Sign Up</button>
    </form>
  );
}

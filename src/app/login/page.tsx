import loginAction from "./actions";

export default function Login() {
  return (
    <form action={loginAction}>
      <label id="email">Email</label>
      <input name="email" required />
      <label id="password">Password</label>
      <input type="password" name="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}

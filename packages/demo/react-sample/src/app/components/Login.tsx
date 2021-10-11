import { useAuth } from 'react-use-auth';

export function Login(): JSX.Element {
  const { isAuthenticated, login, logout, signup, isAuthenticating } = useAuth();

  if (isAuthenticated()) {
    return (
      <>
        <button onClick={logout}>Logout</button>
        <small>{isAuthenticating ? "Verifying ..." : null}</small>
      </>
    )
  } else {
    return (
      <>
        <button onClick={login}>Login</button>
        <button onClick={signup}>Signup</button>
        <small>{isAuthenticating ? "Verifying ..." : null}</small>
      </>
    )
  }
}

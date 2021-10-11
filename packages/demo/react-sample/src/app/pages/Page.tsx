import React from 'react';
import { useAuth } from 'react-use-auth';

export function Page(): JSX.Element {
  const {user, authResult, userId } = useAuth();
  return (
    <>
    <h1>Page</h1>
      <table>
        <thead>
        <tr>
          <td>Key</td>
          <td>Value</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>UserId</td>
          <td>{userId}</td>
        </tr>
        <tr>
          <td>User</td>
          <td><pre>{JSON.stringify(user, null, 4)}</pre></td>
        </tr>
        <tr>
          <td>AuthResult</td>
          <td><pre>{JSON.stringify(authResult, null, 4)}</pre></td>
        </tr>
        </tbody>
      </table>
    </>
  );
}

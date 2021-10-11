import React, { useEffect } from 'react';
import { useAuth } from 'react-use-auth';

export function AuthCallback(): JSX.Element {
  const { handleAuthentication } = useAuth();


  useEffect(() => {
    handleAuthentication({});
  }, [handleAuthentication]);
  return (
    <h1>
      This is the auth callback page, you should be redirected immediately.
    </h1>
  );
}

import {
  AppUserToken,
  JwtTokenBundle,
  TokenResponse,
} from '@rocketbase-commons-ts/auth-api';

export interface OAuthProps {
  clientId: string;
  redirectUri?: string;
  authorizationUri?: string;
  tokenUri?: string;
  userinfoUri?: string;
  endSessionUri?: string;
  registerUri?: string;
  logoutUri?: string;
  signupUri?: string;
  scope?: string;
  audience?: string;
}

export interface JwtTokenBundleWithMeta {
  token?: string;
  tokenExpiresAt: number;
  tokenExpiresIn: number;
  refreshToken?: string;
  refreshTokenExpiresAt: number;
}

export interface AuthSession extends JwtTokenBundleWithMeta {
  user: AppUserToken;
}

export interface AuthCallback extends AuthSession {
  locationBeforeAuth?: string;
}

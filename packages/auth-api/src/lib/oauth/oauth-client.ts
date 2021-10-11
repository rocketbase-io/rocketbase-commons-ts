import {
  AuthCallback,
  AuthSession,
  JwtTokenBundleWithMeta,
  OAuthProps,
} from './shared';
import {
  CACHE_KEY_PREFIX,
  CacheEntry,
  CacheKey,
  CacheManager,
  ICache,
  LocalStorageCache,
} from '../cache';
import { CacheKeyManifest } from '../cache/key-manifest';
import qs from 'qs';
import random from './random';
import { AppUserToken, TokenResponse } from '@rocketbase-commons-ts/auth-api';
import axios from 'axios';

export class OauthClient {
  private cacheManager: CacheManager;

  constructor(
    private readonly config: OAuthProps,
    private cache: ICache = new LocalStorageCache()
  ) {
    this.config = {
      audience: 'default',
      scope: 'profile offline_access',
      ...config,
    };
    this.cacheManager = new CacheManager(
      new CacheKeyManifest(cache, config.clientId)
    );
  }

  private authorizeKey() {
    return `${CACHE_KEY_PREFIX}::auth`;
  }

  public authorize() {
    const id = random();
    const authRedirect = this.cache.get<any>(this.authorizeKey()) || {};
    authRedirect[id] = window.location.href;
    this.cache.set(this.authorizeKey(), authRedirect);

    const params = qs.stringify({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope,
      state: id,
    });

    window.location.href = `${this.config.authorizationUri}?${params}`;
  }

  public parseAuthCallback(): Promise<AuthCallback> {
    return new Promise((resolve, reject) => {
      const params = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      if ('state' in params && 'code' in params) {
        const state = params.state! as string;

        const requestParams = qs.stringify({
          grant_type: 'authorization_code',
          code: params.code,
          redirect_uri: this.config.redirectUri,
        });
        try {
          axios
            .get<TokenResponse>(`${this.config.tokenUri}?${requestParams}`)
            .then(({ data: tokenResponse }) => {
              axios
                .get<AppUserToken>(`${this.config.userinfoUri}`, {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                })
                .then(({ data: userInfo }) => {
                  let locationBeforeAuth: string | undefined = undefined;
                  const authConfigs: any =
                    this.cache.get(this.authorizeKey()) || {};
                  if (state in authConfigs) {
                    locationBeforeAuth = authConfigs[state] as string;
                  }

                  const now = Date.now();
                  const nowSeconds = Math.floor(now / 1000);

                  const token: JwtTokenBundleWithMeta = {
                    token: tokenResponse.access_token,
                    tokenExpiresAt: nowSeconds + tokenResponse.expires_in,
                    tokenExpiresIn: tokenResponse.expires_in,
                    refreshToken: tokenResponse.refresh_token,
                    refreshTokenExpiresAt:
                      tokenResponse.refresh_token &&
                      tokenResponse.refresh_expires_in
                        ? nowSeconds + tokenResponse.refresh_expires_in!
                        : 0,
                  };

                  this.cacheManager.set({
                    user: userInfo,
                    client_id: this.config.clientId,
                    audience: this.config.audience!,
                    scope: tokenResponse.scope,
                    ...token,
                  });

                  resolve({ ...token, user: userInfo, locationBeforeAuth });
                });
            });
        } catch (err) {
          reject();
        } finally {
          // cleanup auth redirect state location
          let authRedirect = this.cache.get<any>(this.authorizeKey()) || {};
          delete authRedirect[state];
          if (Object.keys(authRedirect).length <= 0) {
            this.cache.remove(this.authorizeKey());
          } else {
            this.cache.set(this.authorizeKey(), authRedirect);
          }
        }
      } else {
        reject();
      }
    });
  }

  private cacheEntry() {
    return this.cacheManager.get(
      new CacheKey({
        audience: this.config.audience!,
        scope: this.config.scope!,
        client_id: this.config.clientId!,
      })
    );
  }

  public refreshToken(): Promise<CacheEntry> {
    return new Promise((resolve, reject) => {
      const cachedEntry = this.cacheEntry();
      if (cachedEntry?.refreshToken) {
        const requestParams = qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: cachedEntry?.refreshToken,
        });
        axios
          .get<TokenResponse>(`${this.config.tokenUri}?${requestParams}`)
          .then(({ data: tokenResponse }) => {
            cachedEntry.token = tokenResponse.access_token;
            cachedEntry.tokenExpiresAt =
              Math.floor(Date.now() / 1000) + tokenResponse.expires_in;
            this.cacheManager.set(cachedEntry);
            resolve(cachedEntry);
          })
          .catch((err) => reject(err));
      } else {
        reject();
      }
    });
  }

  public checkSession(): Promise<AuthSession> {
    return new Promise((resolve, reject) => {
      const cachedEntry = this.cacheEntry();
      if (!cachedEntry) {
        reject();
      } else {
        if (cachedEntry.token) {
          resolve(cachedEntry);
        } else if (cachedEntry.refreshToken) {
          this.refreshToken()
            .then((val) => {
              resolve(val);
            })
            .catch((err) => reject(err));
        } else {
          reject();
        }
      }
    });
  }

  public register() {
    if (this.config.registerUri) {
      window.location.href = this.config.registerUri;
    } else {
      console.error('missing registerUri');
    }
  }

  public logout() {
    this.cacheManager.clear(this.config.clientId);
    if (this.config.logoutUri) {
      window.location.href = this.config.logoutUri;
    }
  }
}

import { AuthOptions, AuthProviderClass, ProviderOptions } from 'react-use-auth/dist/types';
import { AppUserToken, TokenResponse } from '../../../auth-client/src';
import random from '../lib/random';
import qs from 'qs';
import axios from 'axios';

export interface CommonsOauthProps {
  clientId?: string;
  server: string;
  redirectUri?: string;
  authorizationUri?: string;
  tokenUri?: string;
  userinfoUri?: string;
  endSessionUri?: string;
  signupUri?: string;
  logoutUri?: string;
  scopes?: string;
  /**
   * used after login when previous url couldn't got
   */
  fallbackRedirectUri?: string;
}

export class CommonsOauth implements AuthProviderClass {
  private readonly dispatch: (eventName: string, eventData?: any) => void;
  private readonly config: CommonsOauthProps;

  // Initialize the client and save any custom config
  constructor(params: AuthOptions) {
    // You will almost always need access to dispatch
    this.dispatch = params.dispatch;
    this.config = params;
  }

  // Makes configuration easier by guessing default options
  static addDefaultParams(params: ProviderOptions, callbackDomain: string) {
    const vals = params as CommonsOauthProps;
    return {
      redirectUri: `${callbackDomain}/auth_callback`,
      authorizationUri: `${vals.server}/oauth/auth`,
      tokenUri: `${vals.server}/oauth/token`,
      userinfoUri: `${vals.server}/auth/me`,
      scope: 'openid profile offline_access',
      signupUri: `${vals.server}/registration`,
      logoutUri: `${vals.server}/logout`,
      fallbackRedirectUri: callbackDomain || (window.location.origin + window.location.pathname),
      ...vals
    };
  }

  public authorize() {
    const id = random();
    localStorage.setItem(id, window.location.href);

    const params = qs.stringify({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes,
      state: id
    });

    window.location.href = `${this.config.authorizationUri}?${params}`;
  }

  public signup() {
    window.open(this.config.signupUri!, '_blank');
  }

  public logout(returnTo?: string) {
    localStorage.removeItem('refreshToken');
    window.location.href  = this.config.logoutUri!;
    // Logout should be done in a separate windows that auto-close afterwards...
  }

  public async handleLoginCallback(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const params = qs.parse(window.location.search);
      if ('state' in params && 'code' in params) {
        const requestParams = qs.stringify({ grant_type: 'authorization_code', code: params.code });
        try {
          axios.get<TokenResponse>(`${this.config.tokenUri}?${requestParams}`)
            .then(({ data: tokenResponse }) => {
              const authResult = {
                expiresIn: tokenResponse.expires_in,
                accessToken: tokenResponse.access_token
              };
              localStorage.setItem('accessToken', authResult.accessToken);
              localStorage.setItem('refreshToken', tokenResponse.refresh_token);

              axios.get<AppUserToken>(`${this.config.userinfoUri}`, { headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` } })
                .then(({ data: userInfo }) => {
                  this.dispatch('AUTHENTICATED', { authResult, userInfo });
                  const state = params.state as string;
                  const redirectUri = localStorage.getItem(state);
                  localStorage.removeItem(state);
                  window.location.href = redirectUri || this.config.fallbackRedirectUri || "/";
                });
            });
        } catch (err) {
          this.dispatch('ERROR', {
            error: err,
            errorType: 'authResult'
          });
          resolve(false);
        }
      } else {
        this.dispatch('ERROR', {
          error: 'state missing',
          errorType: 'authResult'
        });
        resolve(false);
      }
    });
  }

  public userId(user: AppUserToken): string {
    return user?.id;
  }

  public userRoles(user: AppUserToken): string[] | null {
    return user?.capabilities || [];
  }

  public async checkSession(): Promise<{
    user: AppUserToken;
    authResult: any;
  }> {
       return new Promise((resolve, reject) => {
         const refreshToken = localStorage.getItem('refreshToken');
         if (refreshToken) {
           const requestParams = qs.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken });
           axios.get<TokenResponse>(`${this.config.tokenUri}?${requestParams}`)
             .then(({ data: tokenResponse }) => {
               const authResult = {
                 expiresIn: tokenResponse.expires_in,
                 accessToken: tokenResponse.access_token
               };
               localStorage.setItem('accessToken', authResult.accessToken);

               axios.get<AppUserToken>(`${this.config.userinfoUri}`, { headers: { 'Authorization': `Bearer ${tokenResponse.access_token}` } })
                 .then(({ data: userInfo }) => {
                   resolve({user: userInfo, authResult});
                 });
             })
             .catch((err) => {
               localStorage.removeItem('refreshToken');
               reject(err);
             });
         } else {
           reject();
         }
       });
    }
}

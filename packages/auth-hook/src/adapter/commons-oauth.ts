import { AuthOptions, AuthProviderClass, AuthResult, ProviderOptions } from 'react-use-auth/dist/types';
import { AppUserToken, OauthClient, OAuthProps } from '@rocketbase/commons-auth-api';

export interface CommonsOauthProps extends OAuthProps {
  server: string;
  /**
   * used after login when previous url couldn't got
   */
  fallbackRedirectUri?: string;
  signupUri?: string;
}

export class CommonsOauth implements AuthProviderClass {
  private readonly dispatch: (eventName: string, eventData?: any) => void;
  private readonly config: CommonsOauthProps;
  private readonly client: OauthClient;

  // Initialize the client and save any custom config
  constructor(params: AuthOptions) {
    // You will almost always need access to dispatch
    this.dispatch = params.dispatch;
    this.config = params;
    this.client = new OauthClient(params);
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
    this.client.authorize();
  }

  public signup() {
    if (this.config.signupUri) {
      window.open(this.config.signupUri, '_blank');
    }
  }

  public logout(returnTo?: string) {
    this.client.logout();
  }

  public async handleLoginCallback(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.parseAuthCallback()
        .then(({ user, ...callback }) => {
          const authResult = {
            expiresIn: callback.tokenExpiresIn,
            ...callback
          };

          this.dispatch('AUTHENTICATED', { authResult, user });
          resolve(true);
        })
        .catch(err => {

          this.dispatch("ERROR", {
            error: err,
            errorType: "handleAuth"
          });
          resolve(false);
        });
    });
  }

  public userId(user: AppUserToken): string {
    return user?.id;
  }

  public userRoles(user: AppUserToken): string[] | null {
    return user?.capabilities || [];
  }

  public async checkSession(): Promise<{ user: AppUserToken; authResult: AuthResult; }> {
    return new Promise((resolve, reject) => {
      this.client.checkSession()
        .then(({user, ...callback}) => {
          const authResult = {
            expiresIn: callback.tokenExpiresIn,
            ...callback
          };
          resolve({user, authResult});
      })
        .catch(err => {
          reject(err || new Error("Session invalid"));
        })
    });
  }
}

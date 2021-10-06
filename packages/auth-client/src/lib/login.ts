import { buildRequestorFactory, RequestorBuilder } from '../../../util/src';
import type { LoginRequest, LoginResponse } from '../model';
import { AxiosRequestConfig } from 'axios';

export interface NewAccessTokenRequest {
  refreshToken: string;
}

/**
 * authentication via login + refresh jwt access-token
 */
export interface LoginApi {
  login: RequestorBuilder<LoginRequest, LoginResponse>;
  newAccessToken: RequestorBuilder<NewAccessTokenRequest, string>;
}

export function createLoginApi(cf?: AxiosRequestConfig): LoginApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/auth/`,
  });

  const login: LoginApi["login"] = createRequestor({
    method: "post",
    url: "/login",
    body: (request) => request,
  });

  const newAccessToken: LoginApi["newAccessToken"] = createRequestor({
    url: "/refresh",
    headers: ({ refreshToken }) => {
      return { authorization: `Bearer ${refreshToken}` };
    },
  });

  return {
    login,
    newAccessToken,
  };
}

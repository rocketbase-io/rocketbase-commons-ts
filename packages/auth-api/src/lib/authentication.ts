import {
  buildRequestorFactory,
  RequestorBuilder,
} from '@rocketbase/commons-core';
import type {
  AppUserRead,
  EmailChangeRequest,
  ExpirationInfo,
  PasswordChangeRequest,
  UsernameChangeRequest,
  UserProfile,
  UserSetting,
} from '../model';
import { AxiosRequestConfig } from 'axios';

/**
 * endpoints to update authenticated user itself
 */
export interface AuthenticationApi {
  me: RequestorBuilder<void, AppUserRead>;
  changePassword: RequestorBuilder<PasswordChangeRequest, void>;
  changeUsername: RequestorBuilder<UsernameChangeRequest, AppUserRead>;
  changeEmail: RequestorBuilder<
    EmailChangeRequest,
    ExpirationInfo<AppUserRead>
  >;
  verifyEmail: RequestorBuilder<string, AppUserRead>;
  updateProfile: RequestorBuilder<UserProfile, AppUserRead>;
  updateSetting: RequestorBuilder<UserSetting, AppUserRead>;
}

export function createAuthenticationApi(
  cf?: AxiosRequestConfig
): AuthenticationApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ''}/auth`,
  });

  const me: AuthenticationApi['me'] = createRequestor({
    url: '/me',
  });

  const changePassword: AuthenticationApi['changePassword'] = createRequestor({
    method: 'put',
    url: '/change-password',
    body: (request) => request,
  });

  const changeUsername: AuthenticationApi['changeUsername'] = createRequestor({
    method: 'put',
    url: '/change-username',
    body: (request) => request,
  });

  const changeEmail: AuthenticationApi['changeEmail'] = createRequestor({
    method: 'put',
    url: '/change-email',
    body: (request) => request,
  });

  const verifyEmail: AuthenticationApi['verifyEmail'] = createRequestor({
    url: '/verify-email',
    params: (v) => {
      return { verification: v };
    },
  });

  const updateProfile: AuthenticationApi['updateProfile'] = createRequestor({
    method: 'put',
    url: '/update-profile',
    body: (request) => request,
  });

  const updateSetting: AuthenticationApi['updateSetting'] = createRequestor({
    method: 'put',
    url: '/update-setting',
    body: (request) => request,
  });

  return {
    me,
    changePassword,
    changeUsername,
    changeEmail,
    verifyEmail,
    updateProfile,
    updateSetting,
  };
}

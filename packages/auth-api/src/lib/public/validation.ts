import {
  buildRequestorFactory,
  RequestorBuilder,
} from '@rocketbase/commons-core';
import type {
  EmailErrorCodes,
  PasswordErrorCodes,
  TokenErrorCodes,
  UsernameErrorCodes,
  ValidationResponse,
} from '../../model';
import { AxiosRequestConfig } from 'axios';

/**
 * public endpoints for validations
 */
export interface ValidationApi {
  validatePassword: RequestorBuilder<
    string,
    ValidationResponse<PasswordErrorCodes>
  >;
  validateUsername: RequestorBuilder<
    string,
    ValidationResponse<UsernameErrorCodes>
  >;
  validateEmail: RequestorBuilder<string, ValidationResponse<EmailErrorCodes>>;
  validateToken: RequestorBuilder<string, ValidationResponse<TokenErrorCodes>>;
}

export function createValidationApi(cf?: AxiosRequestConfig): ValidationApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ''}/auth/validate`,
  });

  const validatePassword: ValidationApi['validatePassword'] = createRequestor({
    method: 'post',
    url: '/password',
    body: (password) => password,
  });

  const validateUsername: ValidationApi['validateUsername'] = createRequestor({
    method: 'post',
    url: '/username',
    body: (username) => username,
  });

  const validateEmail: ValidationApi['validateEmail'] = createRequestor({
    method: 'post',
    url: '/email',
    body: (email) => email,
  });

  const validateToken: ValidationApi['validateToken'] = createRequestor({
    method: 'post',
    url: '/token',
    body: (token) => token,
  });

  return {
    validatePassword,
    validateUsername,
    validateEmail,
    validateToken,
  };
}

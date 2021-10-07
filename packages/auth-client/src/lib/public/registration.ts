import { buildRequestorFactory, RequestorBuilder } from '@rocketbase/commons-core';
import type { AppUserRead, ExpirationInfo, JwtTokenBundle, RegistrationRequest } from '../../model';
import { AxiosRequestConfig } from 'axios';

/**
 * public interactions for registration flow
 */
export interface RegistrationApi {
  register: RequestorBuilder<RegistrationRequest, ExpirationInfo<AppUserRead>>;
  verify: RequestorBuilder<string, JwtTokenBundle>;
}

export function createRegistrationApi(cf?: AxiosRequestConfig): RegistrationApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/auth/`,
  });

  const register: RegistrationApi["register"] = createRequestor({
    method: "post",
    url: "/register",
    body: (request) => request,
  });

  const verify: RegistrationApi["verify"] = createRequestor({
    url: "/verify",
    params: (v) => {
      return { verification: v };
    },
  });

  return {
    register,
    verify,
  };
}

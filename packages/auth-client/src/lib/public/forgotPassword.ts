import { buildRequestorFactory, RequestorBuilder } from '@rocketbase/commons-core';
import type { AppUserRead, ExpirationInfo, ForgotPasswordRequest, PerformPasswordResetRequest } from '../../model';
import { AxiosRequestConfig } from 'axios';

/**
 * public interactions for password forget flow
 */
export interface ForgotPasswordApi {
  forgotPassword: RequestorBuilder<ForgotPasswordRequest, ExpirationInfo<void>>;
  resetPassword: RequestorBuilder<PerformPasswordResetRequest, AppUserRead>;
}

export function createForgotPasswordApi(cf?: AxiosRequestConfig): ForgotPasswordApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/auth`,
  });

  const forgotPassword: ForgotPasswordApi["forgotPassword"] = createRequestor({
    method: "put",
    url: "/forgot-password",
    body: (request) => request,
  });

  const resetPassword: ForgotPasswordApi["resetPassword"] = createRequestor({
    method: "put",
    url: "/reset-password",
    body: (request) => request,
  });

  return {
    forgotPassword,
    resetPassword,
  };
}

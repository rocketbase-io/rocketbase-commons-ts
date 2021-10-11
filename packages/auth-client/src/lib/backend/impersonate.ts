import {
  buildRequestorFactory,
  RequestorBuilder,
} from '@rocketbase/commons-core';
import type { JwtTokenBundle } from '../../model';
import { AxiosRequestConfig } from 'axios';

/**
 * api resource used by admins to impersonate as someone else
 */
export interface ImpersonateApi {
  impersonate: RequestorBuilder<string, JwtTokenBundle>;
}

export function createImpersonateApi(cf?: AxiosRequestConfig): ImpersonateApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ''}/api/impersonate`,
  });

  const impersonate: ImpersonateApi['impersonate'] = createRequestor({
    url: (userIdOrUsername) => `/${userIdOrUsername}`,
  });

  return {
    impersonate,
  };
}

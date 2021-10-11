import {
  buildRequestorFactory,
  PageableRequest,
  PageableResult,
  RequestorBuilder,
} from '@rocketbase/commons-core';
import type { AppUserRead, QueryAppUser } from '../model';
import { AxiosRequestConfig } from 'axios';

export interface UserSearchQuery extends PageableRequest, QueryAppUser {}

/**
 * user lookups could be accessible for authenticated users
 */
export interface UserSearchApi {
  search: RequestorBuilder<UserSearchQuery, PageableResult<AppUserRead>>;
  findByUsernameOrId: RequestorBuilder<string, AppUserRead>;
}

export function createUserSearchApi(cf?: AxiosRequestConfig): UserSearchApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ''}/api/user-search`,
  });

  const search: UserSearchApi['search'] = createRequestor({
    url: '',
    params: (query) => query,
  });

  const findByUsernameOrId: UserSearchApi['findByUsernameOrId'] =
    createRequestor({
      url: (usernameOrId) => `/${usernameOrId}`,
    });

  return {
    search,
    findByUsernameOrId,
  };
}

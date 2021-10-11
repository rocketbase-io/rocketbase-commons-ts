import {
  buildRequestorFactory,
  PageableRequest,
  PageableResult,
  RequestorBuilder,
} from '@rocketbase/commons-core';
import type {
  AppUserCreate,
  AppUserRead,
  AppUserResetPassword,
  AppUserUpdate,
  QueryAppUser,
} from '../../model';
import { AxiosRequestConfig } from 'axios';

export interface UserQuery extends PageableRequest, QueryAppUser {}

export interface UserUpdate {
  id: number;
  update: AppUserUpdate;
}
export interface ResetPassword {
  id: number;
  reset: AppUserResetPassword;
}

/**
 * backend/admin api to interact with user entities
 */
export interface UserApi {
  find: RequestorBuilder<UserQuery, PageableResult<AppUserRead>>;
  findById: RequestorBuilder<string, AppUserRead>;
  create: RequestorBuilder<AppUserCreate, AppUserRead>;
  resetPassword: RequestorBuilder<ResetPassword, AppUserRead>;
  update: RequestorBuilder<UserUpdate, AppUserRead>;
  patch: RequestorBuilder<UserUpdate, AppUserRead>;
  remove: RequestorBuilder<string, void>;
}

export function createUserApi(cf?: AxiosRequestConfig): UserApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ''}/api/user`,
  });

  const find: UserApi['find'] = createRequestor({
    url: '',
    params: (query) => query,
  });

  const findById: UserApi['findById'] = createRequestor({
    url: (id) => `/${id}`,
  });

  const create: UserApi['create'] = createRequestor({
    method: 'post',
    url: '',
    body: (create) => create,
  });

  const resetPassword: UserApi['resetPassword'] = createRequestor({
    method: 'put',
    url: ({ id }) => `/${id}/password`,
    body: ({ reset }) => reset,
  });

  const update: UserApi['update'] = createRequestor({
    method: 'put',
    url: ({ id }) => `/${id}`,
    body: ({ update }) => update,
  });

  const patch: UserApi['patch'] = createRequestor({
    method: 'patch',
    url: ({ id }) => `/${id}`,
    body: ({ update }) => update,
  });

  const remove: UserApi['remove'] = createRequestor({
    method: 'delete',
    url: (id) => `/${id}`,
  });

  return {
    find,
    findById,
    create,
    resetPassword,
    update,
    patch,
    remove,
  };
}

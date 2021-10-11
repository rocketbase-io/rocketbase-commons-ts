import {
  buildRequestorFactory,
  PageableRequest,
  PageableResult,
  RequestorBuilder,
} from '@rocketbase/commons-core';
import type {
  AppClientRead,
  AppClientWrite,
  QueryAppClient,
} from '../../model';
import { AxiosRequestConfig } from 'axios';

export interface ClientQuery extends PageableRequest, QueryAppClient {}

export interface ClientUpdate {
  id: number;
  write: AppClientWrite;
}

/**
 * backend/admin api to interact with client entities
 */
export interface ClientApi {
  find: RequestorBuilder<ClientQuery, PageableResult<AppClientRead>>;
  findById: RequestorBuilder<number, AppClientRead>;
  create: RequestorBuilder<AppClientWrite, AppClientRead>;
  update: RequestorBuilder<ClientUpdate, AppClientRead>;
  remove: RequestorBuilder<number, void>;
}

export function createClientApi(cf?: AxiosRequestConfig): ClientApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ''}/api/client`,
  });

  const find: ClientApi['find'] = createRequestor({
    url: '/',
    params: (query) => query,
  });

  const findById: ClientApi['findById'] = createRequestor({
    url: (id) => `/${id}`,
  });

  const create: ClientApi['create'] = createRequestor({
    method: 'post',
    url: '/',
    body: (write) => write,
  });

  const update: ClientApi['update'] = createRequestor({
    method: 'put',
    url: ({ id }) => `/${id}`,
    body: ({ write }) => write,
  });

  const remove: ClientApi['remove'] = createRequestor({
    method: 'delete',
    url: (id) => `/${id}`,
  });

  return {
    find,
    findById,
    create,
    update,
    remove,
  };
}

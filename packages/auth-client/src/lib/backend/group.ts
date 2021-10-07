import { buildRequestorFactory, PageableRequest, PageableResult, RequestorBuilder } from '@rocketbase/commons-core';
import type { AppGroupRead, AppGroupWrite, QueryAppGroup } from '../../model';
import { AxiosRequestConfig } from 'axios';

export interface GroupQuery extends PageableRequest, QueryAppGroup {}

export interface GroupCreate {
  parentId: number;
  write: AppGroupWrite;
}

export interface GroupUpdate {
  id: number;
  write: AppGroupWrite;
}

/**
 * backend/admin api to interact with group entities
 */
export interface GroupApi {
  find: RequestorBuilder<GroupQuery, PageableResult<AppGroupRead>>;
  findById: RequestorBuilder<number, AppGroupRead>;
  create: RequestorBuilder<GroupCreate, AppGroupRead>;
  update: RequestorBuilder<GroupUpdate, AppGroupRead>;
  remove: RequestorBuilder<number, void>;
}

export function createGroupApi(cf?: AxiosRequestConfig): GroupApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/api/group`,
  });

  const find: GroupApi["find"] = createRequestor({
    url: "",
    params: (query) => query,
  });

  const findById: GroupApi["findById"] = createRequestor({
    url: (id) => `/${id}`,
  });

  const create: GroupApi["create"] = createRequestor({
    method: "post",
    url: ({ parentId }) => `/${parentId}`,
    body: ({ write }) => write,
  });

  const update: GroupApi["update"] = createRequestor({
    method: "put",
    url: ({ id }) => `/${id}`,
    body: ({ write }) => write,
  });

  const remove: GroupApi["remove"] = createRequestor({
    method: "delete",
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

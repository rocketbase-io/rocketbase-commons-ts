import { buildRequestorFactory, PageableRequest, PageableResult, RequestorBuilder } from '../../../../util/src';
import type { AppCapabilityRead, AppCapabilityWrite, QueryAppCapability } from '../../model';
import { AxiosRequestConfig } from 'axios';

export interface CapabilityQuery extends PageableRequest, QueryAppCapability {}

export interface CapabilityUpdate {
  id: number;
  write: AppCapabilityWrite;
}

/**
 * backend/admin api to interact with capability entities
 */
export interface CapabilityApi {
  find: RequestorBuilder<CapabilityQuery, PageableResult<AppCapabilityRead>>;
  findById: RequestorBuilder<number, AppCapabilityRead>;
  create: RequestorBuilder<AppCapabilityWrite, AppCapabilityRead>;
  update: RequestorBuilder<CapabilityUpdate, AppCapabilityRead>;
  remove: RequestorBuilder<number, void>;
}

export function createCapabilityApi(cf?: AxiosRequestConfig): CapabilityApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/api/capability`,
  });

  const find: CapabilityApi["find"] = createRequestor({
    url: "",
    params: (query) => query,
  });

  const findById: CapabilityApi["findById"] = createRequestor({
    url: (id) => `/${id}`,
  });

  const create: CapabilityApi["create"] = createRequestor({
    method: "post",
    url: "/",
    body: (write) => write,
  });

  const update: CapabilityApi["update"] = createRequestor({
    method: "put",
    url: ({ id }) => `/${id}`,
    body: ({ write }) => write,
  });

  const remove: CapabilityApi["remove"] = createRequestor({
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

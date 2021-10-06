import { buildRequestorFactory, PageableRequest, PageableResult, RequestorBuilder } from '../../../../util/src';
import type { AppTeamRead, AppTeamWrite, QueryAppTeam } from '../../model';
import { AxiosRequestConfig } from 'axios';

export interface TeamQuery extends PageableRequest, QueryAppTeam {}

export interface TeamUpdate {
  id: number;
  write: AppTeamWrite;
}

/**
 * backend/admin api to interact with team entities
 */
export interface TeamApi {
  find: RequestorBuilder<TeamQuery, PageableResult<AppTeamRead>>;
  findById: RequestorBuilder<number, AppTeamRead>;
  create: RequestorBuilder<AppTeamWrite, AppTeamRead>;
  update: RequestorBuilder<TeamUpdate, AppTeamRead>;
  remove: RequestorBuilder<number, void>;
}

export function createTeamApi(cf?: AxiosRequestConfig): TeamApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/api/team`,
  });

  const find: TeamApi["find"] = createRequestor({
    url: "",
    params: (query) => query,
  });

  const findById: TeamApi["findById"] = createRequestor({
    url: (id) => `/${id}`,
  });

  const create: TeamApi["create"] = createRequestor({
    method: "post",
    url: "",
    body: (create) => create,
  });

  const update: TeamApi["update"] = createRequestor({
    method: "put",
    url: ({ id }) => `/${id}`,
    body: ({ write }) => write,
  });

  const remove: TeamApi["remove"] = createRequestor({
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

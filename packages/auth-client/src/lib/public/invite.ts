import { buildRequestorFactory, RequestorBuilder } from '@rocketbase/commons-core';
import type { AppInviteRead, AppUserRead, ConfirmInviteRequest } from '../../model';
import { AxiosRequestConfig } from 'axios';

/**
 * public interactions for invite flow
 */
export interface InviteApi {
  verify: RequestorBuilder<number, AppInviteRead>;
  transformToUser: RequestorBuilder<ConfirmInviteRequest, AppUserRead>;
}

export function createInviteApi(cf?: AxiosRequestConfig): InviteApi {
  const createRequestor = buildRequestorFactory(cf, {
    baseURL: `${cf?.baseURL ?? ""}/auth/invite`,
  });

  const verify: InviteApi["verify"] = createRequestor({
    url: "",
    params: (id) => {
      return { inviteId: id };
    },
  });

  const transformToUser: InviteApi["transformToUser"] = createRequestor({
    method: "post",
    url: "/",
    body: (request) => request,
  });

  return {
    verify,
    transformToUser,
  };
}

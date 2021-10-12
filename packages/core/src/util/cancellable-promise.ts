import { AxiosResponse } from 'axios';

export interface CancellablePromise<T> extends Promise<T> {
  /**
   * allow to cancel axios query
   */
  cancel: () => void;
}

export const createCancellablePromise = <Result>(axiosCall: CancellablePromise<AxiosResponse<Result>>) => {
  const promise = new Promise<Result>((resolve, reject) => {
    axiosCall.then(({ data }) => resolve(data)).catch((e) => reject(e));
  });
  (promise as any)["cancel"] = axiosCall.cancel;
  return promise;
};

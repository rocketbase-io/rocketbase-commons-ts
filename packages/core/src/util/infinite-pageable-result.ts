import { UseInfiniteQueryOptions } from "react-query/types/react/types";
import { PageableResult } from '../model';

export function createInfiniteOptions<TQueryFnData extends PageableResult<unknown>, TError, TData>(
  overrides: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData> = {}
): UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData> {
  return {
    getPreviousPageParam: ({ page }) => {
      return page !== 0 ? page - 1 : 0;
    },
    getNextPageParam: ({ page, totalPages }) => {
      return page < totalPages - 1 ? page + 1 : undefined;
    },
    ...overrides,
  };
}

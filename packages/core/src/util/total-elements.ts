import { PageableResult } from '../model';
import { InfiniteData } from 'react-query/types/core/types';

export function infiniteTotalElements<T>(
  data: InfiniteData<PageableResult<T>>
): number {
  if (data && Array.isArray(data?.pages) && data?.pages.length) {
    return data.pages[0].totalElements;
  }
  return 0;
}

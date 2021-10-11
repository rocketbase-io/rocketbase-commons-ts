import { AuthSession } from '../oauth/shared';

export const CACHE_KEY_PREFIX = '@@commonsauth@@';

export interface CacheKeyData {
  audience: string;
  scope: string;
  client_id: string;
}

export class CacheKey {
  public client_id: string;
  public scope: string;
  public audience: string;

  constructor(data: CacheKeyData, public prefix: string = CACHE_KEY_PREFIX) {
    this.client_id = data.client_id;
    this.scope = data.scope;
    this.audience = data.audience;
  }

  /**
   * Converts this `CacheKey` instance into a string for use in a cache
   * @returns A string representation of the key
   */
  toKey(): string {
    return `${this.prefix}::${this.client_id}::${this.audience}::${this.scope}`;
  }

  /**
   * Converts a cache key string into a `CacheKey` instance.
   * @param key The key to convert
   * @returns An instance of `CacheKey`
   */
  static fromKey(key: string): CacheKey {
    const [prefix, client_id, audience, scope] = key.split('::');
    return new CacheKey({ client_id, scope, audience }, prefix);
  }

  /**
   * Utility function to build a `CacheKey` instance from a cache entry
   * @param entry The entry
   * @returns An instance of `CacheKey`
   */
  static fromCacheEntry(entry: CacheEntry): CacheKey {
    const { client_id, scope, audience } = entry;
    return new CacheKey({ client_id, scope, audience });
  }
}

export interface CacheEntry extends AuthSession {
  audience: string;
  scope: string;
  client_id: string;
}

export interface KeyManifestEntry {
  keys: string[];
}

export type Cacheable = CacheEntry | KeyManifestEntry;

export interface ICache {
  set<T = Cacheable>(key: string, entry: T): void;

  get<T = Cacheable>(key: string): T | undefined;

  remove(key: string): void;

  allKeys(): string[];
}

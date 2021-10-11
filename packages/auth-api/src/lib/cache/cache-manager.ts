import { CacheKeyManifest } from './key-manifest';
import { CacheEntry, ICache, CacheKey, CACHE_KEY_PREFIX } from './shared';
import { LocalStorageCache } from './cache-localstorage';

const DEFAULT_EXPIRY_ADJUSTMENT_SECONDS = 10;

export class CacheManager {
  constructor(
    private keyManifest?: CacheKeyManifest,
    private cache: ICache = new LocalStorageCache()
  ) {}

  get(
    cacheKey: CacheKey,
    expiryAdjustmentSeconds = DEFAULT_EXPIRY_ADJUSTMENT_SECONDS
  ): CacheEntry | undefined {
    let entry = this.cache.get<CacheEntry>(cacheKey.toKey());

    if (!entry) {
      const keys = this.getCacheKeys();

      if (!keys) return;

      const matchedKey = this.matchExistingCacheKey(cacheKey, keys);
      entry = this.cache.get<CacheEntry>(matchedKey);
    }

    // If we still don't have an entry, exit.
    if (!entry) {
      return;
    }

    const now = Date.now();
    const nowSeconds = Math.floor(now / 1000);

    // only return cache when accessToken or refreshToken is valid
    if (entry.tokenExpiresAt - expiryAdjustmentSeconds < nowSeconds) {
      if (
        entry.refreshToken &&
        entry.refreshTokenExpiresAt - expiryAdjustmentSeconds > nowSeconds
      ) {
        return { ...entry, token: undefined };
      }

      this.cache.remove(cacheKey.toKey());
      this.keyManifest?.remove(cacheKey.toKey());

      return;
    }

    return entry;
  }

  set(entry: CacheEntry) {
    const cacheKey = new CacheKey({
      client_id: entry.client_id,
      scope: entry.scope,
      audience: entry.audience,
    });

    this.cache.set(cacheKey.toKey(), entry);
    this.keyManifest?.add(cacheKey.toKey());
  }

  clear(clientId?: string): void {
    const keys = this.cache.allKeys() || [];

    /* istanbul ignore next */
    if (!keys) return;

    keys
      .filter((key) => (clientId ? key.includes(clientId) : true))
      .forEach((key) => {
        this.cache.remove(key);
      });
  }

  private getCacheKeys(): string[] {
    return this.keyManifest
      ? this.keyManifest.get()?.keys
      : this.cache.allKeys();
  }

  private matchExistingCacheKey(keyToMatch: CacheKey, allKeys: Array<string>) {
    return allKeys.filter((key) => {
      const cacheKey = CacheKey.fromKey(key);
      const scopeSet = new Set(cacheKey.scope && cacheKey.scope.split(' '));
      const scopesToMatch = keyToMatch.scope.split(' ');

      const hasAllScopes =
        cacheKey.scope &&
        scopesToMatch.reduce(
          (acc, current) => acc && scopeSet.has(current),
          true
        );

      return (
        cacheKey.prefix === CACHE_KEY_PREFIX &&
        cacheKey.client_id === keyToMatch.client_id &&
        cacheKey.audience === keyToMatch.audience &&
        hasAllScopes
      );
    })[0];
  }
}

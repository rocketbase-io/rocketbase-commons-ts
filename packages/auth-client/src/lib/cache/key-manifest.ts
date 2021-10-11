import { CACHE_KEY_PREFIX, ICache, KeyManifestEntry } from './shared';

export class CacheKeyManifest {
  private readonly manifestKey: string;

  constructor(private cache: ICache, private clientId: string) {
    this.manifestKey = this.createManifestKeyFrom(this.clientId);
  }

  add(key: string) {
    const keys = new Set(
      this.cache.get<KeyManifestEntry>(this.manifestKey)?.keys || []
    );

    keys.add(key);
    this.cache.set<KeyManifestEntry>(this.manifestKey, {
      keys: [...keys],
    });
  }

  remove(key: string): void {
    const entry = this.cache.get<KeyManifestEntry>(this.manifestKey);

    if (entry) {
      const keys = new Set(entry.keys);
      keys.delete(key);

      if (keys.size > 0) {
        this.cache.set(this.manifestKey, { keys: [...keys] });
      }

      this.cache.remove(this.manifestKey);
    }
  }

  get(): KeyManifestEntry {
    return this.cache.get<KeyManifestEntry>(this.manifestKey)!;
  }

  clear(): void {
    return this.cache.remove(this.manifestKey);
  }

  private createManifestKeyFrom(clientId: string): string {
    return `${CACHE_KEY_PREFIX}::${clientId}`;
  }
}

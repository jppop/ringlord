
import { KeyValueCache } from 'apollo-server-caching';

const defaultOptions = { ttl: 300 };

export class PersonalDataCache {

  constructor(keyValueCache, options) {
    this.keyValueCache = keyValueCache;
    this.options = { ...defaultOptions, ...options };
  }

  cacheKey(personalData) {
    return personalData.id;
  }

  async get(id) {
    const item = await this.keyValueCache.get(id);
    if (item) {
      return JSON.parse(item);
    }
  }

  async set(personalData) {
    return await this.keyValueCache.set(this.cacheKey(personalData), JSON.stringify(personalData),
      { ttl: this.options.ttl });
  }
}


import { KeyValueCache } from 'apollo-server-caching';

const defaultOptions = { ttl: 300 };

export class PersonalDataCache {

  constructor(keyValueCache, options) {
    this.options = { ...defaultOptions, ...options };
  }

  cacheKey(personalData) {
    return personalData.id;
  }

  async get(id) {
    const item = await this.keyValueCache.get(this.cacheKey(id));
    if (item) {
      return JSON.parse(item);
    }
  }

  async set(personalData) {
    return await this.keyValueCache.set(this.cacheKey(personalData.id), JSON.stringify(personalData),
      { ttl: this.options.ttl });
  }
}

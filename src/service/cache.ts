import { Cache } from "memory-cache";


const cacheInstance = new Cache();

const set = (key: string, value: any, duration: number) => {
  cacheInstance.put(key, JSON.stringify(value), duration * 1000);
};

const get = (key: string) => {
  return JSON.parse(cacheInstance.get(key) as string);
};

const getMany = (keys: string[]) => {
  return keys.map(key => get(key));
};

const setMany = (kv: { [key: string]: any }, duration: number) => {
  Object.keys(kv).forEach(key => set(key, kv[key], duration));
};

const clear = () => {
  cacheInstance.clear();
};

const CacheService = {
  set,
  get,
  getMany,
  setMany,
  clear
};

export default CacheService;
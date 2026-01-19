import { isUndefined } from "./utils";

export function Memoize<Args extends any[]>(
  duration: number = 0,
  computeKey: ((...args: Args) => PropertyKey) | PropertyKey = (...args: Args) => args[0],
  isCacheVoid = false,
) {
  return function (_: any, name: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    const originalGet = descriptor.get;

    // 使用 WeakMap 为每个实例存储独立的缓存
    const instanceCaches = new WeakMap<any, Map<PropertyKey, { value: any; expireTime: number }>>();
    const cacheId = Symbol(String(name));

    // 获取实例的缓存
    const getInstanceCache = (instance: any) => {
      if (!instanceCaches.has(instance)) {
        instanceCaches.set(instance, new Map());
      }
      return instanceCaches.get(instance)!;
    };

    const isExpired = (expireTime: number) => duration > 0 && expireTime < Date.now();

    // computeKey 可能是常量也可能是函数；为了支持 getter（无参数），接受任意参数并在内部调用
    const computeCacheKey = (...args: any[]) =>
      (typeof computeKey === "function" ? computeKey(...(args as Args)) : computeKey) ?? cacheId;

    // 方法装饰器（有 value）
    if (typeof originalMethod === "function") {
      descriptor.value = function (...args: Args) {
        const cachedData = getInstanceCache(this);
        const key = computeCacheKey(...args);
        const cached = cachedData.get(key);

        if (!cached || isExpired(cached.expireTime)) {
          const expireTime = Date.now() + duration;
          const v = originalMethod.apply(this, args);
          if (v instanceof Promise) {
            cachedData.set(key, { value: v, expireTime });
            v.then((vr: any) => {
              if (!isCacheVoid && isUndefined(vr)) {
                cachedData.delete(key);
              }
            });
          } else {
            if (isCacheVoid || !isUndefined(v)) {
              cachedData.set(key, { value: v, expireTime });
            }
          }
        }
        return cachedData.get(key)?.value;
      };
    }

    // getter 装饰器（有 get）
    if (typeof originalGet === "function") {
      descriptor.get = function () {
        const cachedData = getInstanceCache(this);
        // getter 没有参数，computeKey 将被调用时不带参数
        const key = computeCacheKey();
        const cached = cachedData.get(key);

        if (!cached || isExpired(cached.expireTime)) {
          const expireTime = Date.now() + duration;
          const v = originalGet.apply(this);
          if (v instanceof Promise) {
            cachedData.set(key, { value: v, expireTime });
            v.then((vr: any) => {
              if (!isCacheVoid && isUndefined(vr)) {
                cachedData.delete(key);
              }
            });
          } else {
            if (isCacheVoid || !isUndefined(v)) {
              cachedData.set(key, { value: v, expireTime });
            }
          }
        }
        return cachedData.get(key)?.value;
      };
    }

    return descriptor;
  };
}

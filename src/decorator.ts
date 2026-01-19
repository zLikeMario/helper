/**
 * TypeScript 5.0
 * 新版本的装饰器写法
 */
import { isUndefined } from "./utils";

export function Memoize<Args extends any[]>(
  duration: number = 0,
  computeKey: ((...args: Args) => PropertyKey) | PropertyKey = (...args: Args) => args[0],
  isCacheVoid = false
) {
  return function <T>(originalMethod: (...args: Args) => T, context: ClassMemberDecoratorContext) {
    const cacheId = Symbol(String(context.name));
    const isExpired = (expireTime: number) => duration > 0 && expireTime < Date.now();

    // 静态方法使用 Map
    const staticCachedData = new Map<PropertyKey, { value: T; expireTime: number }>();

    // 实例方法使用 WeakMap 为每个实例存储独立的缓存
    const instanceCaches = new WeakMap<any, Map<PropertyKey, { value: T; expireTime: number }>>();

    // 获取实例的缓存
    const getInstanceCache = (instance: any) => {
      if (!instanceCaches.has(instance)) {
        instanceCaches.set(instance, new Map());
      }
      return instanceCaches.get(instance)!;
    };

    function replacementMethod(this: any, ...args: Args) {
      const key = (typeof computeKey === "function" ? computeKey(...args) : computeKey) ?? cacheId;
      
      // 判断是静态方法还是实例方法
      const isStatic = context.static;
      const cachedData = isStatic ? staticCachedData : getInstanceCache(this);
      const cached = cachedData.get(key);

      if (!cached || isExpired(cached.expireTime)) {
        const expireTime = Date.now() + duration;
        const v = originalMethod.apply(this, args);
        if (v instanceof Promise) {
          cachedData.set(key, { value: v, expireTime });
          v.then((vr) => {
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
      return cachedData.get(key)?.value!;
    }

    return replacementMethod;
  };
}

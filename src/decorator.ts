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
  return function <T>(originalMethod: (...args: Args) => T) {
    const cachedData = new Map<PropertyKey, T>();
    let cachedTime = Date.now();
    const isExpired = () => duration > 0 && cachedTime < Date.now();

    function replacementMethod(this: any, ...args: Args) {
      const key = typeof computeKey === "function" ? computeKey(...args) : computeKey;
      if (!cachedData.get(key) || isExpired()) {
        cachedTime = Date.now() + duration;
        const v = originalMethod.apply(this, args);
        if (v instanceof Promise) {
          cachedData.set(key, v);
          v.then((vr) => {
            if (!isCacheVoid && isUndefined(vr)) {
              cachedData.delete(key);
            }
          });
        } else {
          if (isCacheVoid || !isUndefined(v)) {
            cachedData.set(key, v);
          }
        }
      }
      return cachedData.get(key)!;
    }

    return replacementMethod;
  };
}

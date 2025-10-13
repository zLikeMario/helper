import { isUndefined } from "./utils";

export function memoize<Args extends any[]>(
  duration: number = 0,
  computeKey: ((...args: Args) => PropertyKey) | PropertyKey = (...args: Args) => args[0],
  isCacheVoid = false
) {
  return function <T>(
    _target: Object,
    _key: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: Args) => Promise<T>>
  ): TypedPropertyDescriptor<(...args: Args) => Promise<T>> | void {
    const originalMethod = descriptor.value!;
    const cachedData = new Map<PropertyKey, MaybeUndefined<T>>();
    let cachedTime = Date.now();
    const isExpired = () => duration > 0 && cachedTime < Date.now();

    descriptor.value = async function (...args: Args) {
      const key = typeof computeKey === "function" ? computeKey(...args) : computeKey;
      if (!cachedData.get(key) || isExpired()) {
        cachedTime = Date.now() + duration;
        const v = await originalMethod.apply(this, args);
        if (isCacheVoid || !isUndefined(v)) {
          cachedData.set(key, v);
        }
      }
      return cachedData.get(key)!;
    };

    return descriptor;
  };
}

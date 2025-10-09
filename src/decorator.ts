import { isUndefined } from "./utils";

export function memoize<Args extends unknown[]>(
  duration: number = 0,
  computeKey = (...args: Args) => args[0],
  isCacheVoid = false
) {
  return function <T>(
    _: unknown,
    _key: string,
    descriptor: TypedPropertyDescriptor<(...args: Args) => Promise<T>>
  ): TypedPropertyDescriptor<(...args: Args) => Promise<T>> | void {
    const originalMethod = descriptor.value!;
    const cachedData = new Map<string | symbol, MaybeUndefined<T>>();
    let cachedTime = Date.now();
    const isExpired = () => duration > 0 && cachedTime < Date.now();

    descriptor.value = async function (...args: Args) {
      const key = computeKey(...args);
      if (!cachedData.get(key as string) || isExpired()) {
        cachedTime = Date.now() + duration;
        const v = await originalMethod.apply(this, args);
        if (isCacheVoid || !isUndefined(v)) {
          cachedData.set(key as string, v);
        }
      }
      return cachedData.get(key as string)!;
    };

    return descriptor;
  };
}

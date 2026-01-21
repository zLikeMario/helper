import { preventTimeout } from "../utils";

const useCatchError = <Args extends any[], R, IsThrowError extends boolean = false>(
  execute: (...args: Args) => MaybePromise<R>,
  options?: Partial<{
    target: string; // 当前执行的操作，一般用来定位错误的位置
    timeout: number; // 任务的超时时间，超时后会优先抛错, 默认 20000ms
    timeoutError: any; // 超时后抛出的错误，默认是 new Error(`${target} Timeout of ${timeout}ms exceeded`)
    isThrowError: IsThrowError; // 是否在报错后 thrwo 错误
    onError: (error: unknown, target: MaybeUndefined<string>, ...args: Args) => any;
  }>,
) => {
  const timeout = options?.timeout ?? 20000;
  const _options = {
    timeout,
    timeoutError: options?.timeoutError
      ? options?.timeoutError
      : new Error(`${options?.target ? `${options?.target} ` : ""}Timeout of ${timeout}ms exceeded`),
    isThrowError: (options?.isThrowError ?? false) as IsThrowError,
    ...options,
  };

  return (async (...args: Args) => {
    try {
      return await preventTimeout(Promise.resolve(execute(...args)), {
        timeout: _options.timeout,
        timeoutError: _options.timeoutError,
      });
    } catch (error) {
      _options.onError?.(error, _options.target, ...args);

      if (_options.isThrowError) {
        throw error;
      }

      return void 0 as IsThrowError extends true ? never : undefined;
    }
  }) as (...args: Args) => Promise<IsThrowError extends true ? R : MaybeUndefined<R>>;
};

export default useCatchError;

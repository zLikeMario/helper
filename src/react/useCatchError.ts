import { useCallback } from "react";
import { preventTimeout } from "../utils";
import useSyncedRef from "./useSyncedRef";
import type { MaybePromise, MaybeUndefined } from "../types";

/**
 * 包装异步/同步任务，统一超时与错误处理。
 *
 * 用法：
 * const run = useCatchError(exec, { target, timeout, isThrowError, onError });
 *
 * - 支持超时控制
 * - 可选择是否继续抛错
 * - onError 可用于埋点或兜底处理
 */
const useCatchError = <Args extends any[], R, IsThrowError extends boolean = false>(
  execute: (...args: Args) => MaybePromise<R>,
  options?: Partial<{
    target: string; // 当前执行的操作，一般用来定位错误的位置
    timeout: number; // 任务的超时时间，超时后会优先抛错, 默认 20000ms
    timeoutError: any; // 超时后抛出的错误，默认是 new Error(`${target} Timeout of ${timeout}ms exceeded`)
    isThrowError: IsThrowError; // 是否在报错后继续 throw 错误
    onError: (error: unknown, target: MaybeUndefined<string>, ...args: Args) => any;
  }>,
) => {
  const timeout = options?.timeout ?? 20000;
  // 保持最新配置与执行函数。
  const states = useSyncedRef({
    options: {
      timeout,
      timeoutError: options?.timeoutError
        ? options?.timeoutError
        : new Error(`${options?.target ? `${options?.target} ` : ""}Timeout of ${timeout}ms exceeded`),
      isThrowError: (options?.isThrowError ?? false) as IsThrowError,
      ...options,
    },
    execute,
  });

  return useCallback(async (...args: Args) => {
    try {
      // 执行并施加超时限制。
      return await preventTimeout(Promise.resolve(states.current.execute(...args)), {
        timeout: states.current.options.timeout,
        timeoutError: states.current.options.timeoutError,
      });
    } catch (error) {
      // 先回调错误处理，再根据配置决定是否抛出。
      states.current.options.onError?.(error, states.current.options.target, ...args);

      if (states.current.options.isThrowError) {
        throw error;
      }

      return void 0 as IsThrowError extends true ? never : undefined;
    }
  }, []);
};

export default useCatchError;

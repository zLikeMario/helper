import { useCallback, useRef, useState } from "react";
import useSyncedRef from "./useSyncedRef";
import type { MaybeUndefined } from "../types";

/**
 * 包装异步执行函数，返回带 loading 状态的调用器。
 *
 * 用法：
 * const [run, isLoading] = useLoadingEvent(exec, { isAllowMulticall });
 *
 * - 默认不允许并发，重复调用会复用上一次 Promise
 * - 可通过 isAllowMulticall 允许并发调用
 */
const useLoadingEvent = <Args extends any[], R extends any>(
  execute: (...args: Args) => Promise<R>,
  options?: Partial<{
    isAllowMulticall: boolean;
  }>,
): [(...args: Args) => Promise<R>, boolean] => {
  const [isLoading, __setIsLoading] = useState(false);
  const currentExecuteId = useRef(0);
  const resolvePromise = useRef<MaybeUndefined<Promise<R>>>(void 0);
  const states = useSyncedRef({
    options: {
      /**
       * 是否允许函数多次调用，默认: false
       * false 情况下，如果再次执行 execute 会引用上一次的 promise 直接返回
       */
      isAllowMulticall: false,
      ...options,
    },
    execute,
    isLoading,
  });

  const handleSetIsLoading = (flag: boolean) => {
    states.current.isLoading = flag;
    __setIsLoading(flag);
  };

  return [
    useCallback(async (...args: Args) => {
      // 默认复用进行中的请求，避免重复触发。
      if (states.current.isLoading && resolvePromise.current && !states.current.options.isAllowMulticall) {
        return resolvePromise.current;
      }

      handleSetIsLoading(true);
      const executeId = (currentExecuteId.current += 1);

      // 仅在最新请求完成时关闭 loading。
      resolvePromise.current = states.current.execute(...args).finally(() => {
        const isLatestPromise = executeId === currentExecuteId.current;
        if (isLatestPromise) {
          resolvePromise.current = undefined;
          handleSetIsLoading(false);
        }
      });
      return resolvePromise.current;
    }, []),
    isLoading,
  ];
};

export default useLoadingEvent;

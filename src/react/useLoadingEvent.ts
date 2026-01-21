import { useCallback, useRef, useState } from "react";
import useSyncedRef from "./useSyncedRef";

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
      if (states.current.isLoading && resolvePromise.current && !states.current.options.isAllowMulticall) {
        return resolvePromise.current;
      }

      handleSetIsLoading(true);
      const executeId = (currentExecuteId.current += 1);

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

import { computed, ref, type ComputedRef } from "vue";
import type { MaybeUndefined } from "../types";

const useLoadingEvent = <Args extends any[], R extends any>(
  execute: (...args: Args) => Promise<R>,
  options?: Partial<{
    isAllowMulticall: boolean;
  }>,
): [(...args: Args) => Promise<R>, ComputedRef<boolean>] => {
  const _options = {
    /**
     * 是否允许函数多次调用，默认: false
     * false 情况下，如果再次执行 execute 会引用上一次的 promise 直接返回
     */
    isAllowMulticall: false,
    ...options,
  };

  const isLoading = ref(false);

  let currentExecuteId = 0;
  let resolvePromise: MaybeUndefined<Promise<R>>;

  return [
    async (...args: Args) => {
      if (isLoading.value && resolvePromise && !_options.isAllowMulticall) return resolvePromise;

      isLoading.value = true;
      const executeId = (currentExecuteId += 1);

      resolvePromise = execute(...args).finally(() => {
        const isLatestPromise = executeId === currentExecuteId;
        if (isLatestPromise) {
          resolvePromise = undefined;
          isLoading.value = false;
        }
      });
      return resolvePromise;
    },
    computed(() => isLoading.value),
  ];
};

export default useLoadingEvent;

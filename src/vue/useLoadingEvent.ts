import { computed, ref, type ComputedRef } from "vue";
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
      // 默认复用进行中的请求，避免重复触发。
      if (isLoading.value && resolvePromise && !_options.isAllowMulticall) return resolvePromise;

      isLoading.value = true;
      const executeId = (currentExecuteId += 1);

      // 仅在最新请求完成时关闭 loading。
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

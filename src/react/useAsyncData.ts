import { useCallback, useEffect, useState } from "react";
import { tryCatchAsync } from "../utils";
import useSyncedRef from "./useSyncedRef";
import type { MaybeUndefined } from "../types";

/**
 * 用于加载异步数据并提供手动刷新能力的 React hook。
 *
 * 用法：
 * const [data, refresh] = useAsyncData(fetcher, { defaultData, onError });
 *
 * - 组件挂载时调用一次 `fetcher`
 * - 返回最新数据与刷新函数
 * - 若提供 `onError`，其返回值会作为数据
 */
const useAsyncData = <R>(
  getDataFunc: () => Promise<R>,
  options?: Partial<{
    defaultData: R;
    onError: (error: unknown) => any;
  }>,
): [MaybeUndefined<R>, () => void] => {
  // 保持最新的执行函数与配置，避免重复创建回调。
  const states = useSyncedRef({ execute: getDataFunc, options: { ...options } });
  const [data, setData] = useState<MaybeUndefined<R>>(states.current.options.defaultData);

  const updateData = useCallback(() => {
    // 成功时更新数据，失败时使用 onError 或 defaultData 作为回退值。
    tryCatchAsync(
      states.current.execute(),
      states.current.options.onError ?? (() => states.current.options.defaultData),
    ).then((r) => {
      setData(r);
    });
  }, []);

  useEffect(() => {
    updateData();
  }, []);

  return [data, updateData];
};

export default useAsyncData;

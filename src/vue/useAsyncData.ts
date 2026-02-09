import { tryCatchAsync } from "../utils";
import { computed, ref, toRef, unref, type ComputedRef, type MaybeRef } from "vue";
import type { MaybeUndefined } from "../types";

/**
 * 用于加载异步数据并提供手动刷新能力的 Vue hook。
 *
 * 用法：
 * const [data, refresh] = useAsyncData(fetcher, { defaultData, onError });
 *
 * - 立即执行一次 `fetcher`
 * - 返回计算属性与刷新函数
 * - 若提供 `onError`，其返回值会作为数据
 */
const useAsyncData = <R>(
  getDataFunc: () => Promise<R>,
  options?: Partial<{
    defaultData: MaybeRef<R>;
    onError: (error: unknown) => any;
  }>,
): [ComputedRef<MaybeUndefined<R>>, () => void] => {
  // 允许 defaultData 使用 ref 或普通值。
  const _defaultData = toRef(() => unref(options?.defaultData));
  const data = ref<MaybeUndefined<R>>(_defaultData.value);

  const updateData = async () => {
    // 成功时更新数据，失败时使用 onError 或 defaultData 作为回退值。
    await tryCatchAsync(getDataFunc(), options?.onError ?? (() => _defaultData.value)).then((r) => {
      data.value = r;
    });
  };

  // 初始化时拉取一次数据。
  updateData();

  return [computed(() => data.value), updateData];
};

export default useAsyncData;

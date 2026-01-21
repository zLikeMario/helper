import { tryCatchAsync } from "../utils";
import { computed, ref, toRef, unref, type ComputedRef, type MaybeRef } from "vue";
import type { MaybeUndefined } from "../types";

const useAsyncData = <R>(
  getDataFunc: () => Promise<R>,
  options?: Partial<{
    defaultData: MaybeRef<R>;
    onError: (error: unknown) => any;
  }>,
): [ComputedRef<MaybeUndefined<R>>, () => void] => {
  const _defaultData = toRef(() => unref(options?.defaultData));
  const data = ref<MaybeUndefined<R>>(_defaultData.value);

  const updateData = async () => {
    await tryCatchAsync(getDataFunc(), options?.onError ?? (() => _defaultData.value)).then((r) => {
      data.value = r;
    });
  };

  updateData();

  return [computed(() => data.value), updateData];
};

export default useAsyncData;

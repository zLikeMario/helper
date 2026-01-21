import { useCallback, useEffect, useState } from "react";
import { tryCatchAsync } from "../utils";
import useSyncedRef from "./useSyncedRef";
import type { MaybeUndefined } from "../types";

const useAsyncData = <R>(
  getDataFunc: () => Promise<R>,
  options?: Partial<{
    defaultData: R;
    onError: (error: unknown) => any;
  }>,
): [MaybeUndefined<R>, () => void] => {
  const states = useSyncedRef({ execute: getDataFunc, options: { ...options } });
  const [data, setData] = useState<MaybeUndefined<R>>(states.current.options.defaultData);

  const updateData = useCallback(() => {
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

import { useMemo, useRef } from "react";

/**
 * 创建一个只读 ref，并始终同步最新的值。
 *
 * 用法：
 * const states = useSyncedRef({ execute, options });
 */
const useSyncedRef = <T>(value: T) => {
  const _value = useRef(value);
  _value.current = value;
  return useMemo(
    () =>
      Object.freeze({
        get current() {
          return _value.current;
        },
      }),
    [],
  );
};

export default useSyncedRef;

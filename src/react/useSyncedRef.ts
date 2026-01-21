import { useMemo, useRef } from "react";

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

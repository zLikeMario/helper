# @zlikemario/helper - Agents Guide (Use)

面向“使用这个库”的 AI。目标：用最少 token 快速定位方法 + 看到即用的示例。

## 1. 快速入口

- 默认入口：`@zlikemario/helper` 等价于 `@zlikemario/helper/number`
- 子路径入口：`/number`、`/utils`、`/decorator`、`/decorator-old`、`/react`、`/vue`、`/types`

## 2. 方法速查（只列名称，先定位，再看下面示例）

### number

`BigNumber` `isNumber` `simplifyNumber` `readabilityNumber` `toPercentage` `formatPrecision` `readableNumber` `sum` `sumBy`

### utils

`sleep` `encrypt` `isUndefined` `isHasUndefined` `isPromise` `uint8ArrayToBase64` `base64ToUint8Array` `arrayBufferToBase64` `isDomain` `isEmail` `tryCatchAsync` `preventTimeout` `computeWithDefinedParams`

### decorator

`Memoize`

### decorator-old

`Memoize`

### react

`useAsyncData` `useCatchError` `useLoadingEvent` `useSyncedRef`

### vue

`useAsyncData` `useCatchError` `useLoadingEvent`

### types

`Numberish` `NumberString` `MaybeNull` `MaybeUndefined` `MaybePromise` `Defined` `AnyFn` `Noop`

## 3. 用法速览（按模块分组，一函数一用法）

### number

导入路径：`@zlikemario/helper/number`

```ts
import {
  BigNumber,
  isNumber,
  simplifyNumber,
  readabilityNumber,
  toPercentage,
  formatPrecision,
  readableNumber,
  sum,
  sumBy,
} from "@zlikemario/helper/number";
```

```ts
isNumber("123");
isNumber("12.3", true);
```

```ts
simplifyNumber(1234567); // "1.2M"
simplifyNumber("999", 2); // "999"
```

```ts
readabilityNumber(1234567.89); // "1,234,567.89"
```

```ts
toPercentage(0.1234); // "12.34%"
toPercentage(0.1234, 1, true); // "12.3"
```

```ts
formatPrecision("1.234567", 2); // "1.23"
```

```ts
readableNumber("1234.0000123", 4); // "1,234.0{4}12"
```

```ts
sum(["0.1", 0.2, 0.3]); // "0.6"
```

```ts
sumBy([{ n: 1 }, { n: 2 }], "n"); // "3"
sumBy([{ n: 1 }, { n: 2 }], (item) => item.n * 2); // "6"
```

```ts
const v = new BigNumber("0.1").plus("0.2");
v.toString(); // "0.3"
```

### utils

导入路径：`@zlikemario/helper/utils`

```ts
import {
  sleep,
  encrypt,
  isUndefined,
  isHasUndefined,
  isPromise,
  uint8ArrayToBase64,
  base64ToUint8Array,
  arrayBufferToBase64,
  isDomain,
  isEmail,
  tryCatchAsync,
  preventTimeout,
  computeWithDefinedParams,
} from "@zlikemario/helper/utils";
```

```ts
await sleep(1000);
```

```ts
encrypt("1234567890", 2, 2); // "12...90"
```

```ts
isUndefined(undefined); // true
isHasUndefined(1, undefined, 3); // true
```

```ts
isPromise(Promise.resolve(1)); // true
```

```ts
uint8ArrayToBase64(new Uint8Array([1, 2, 3]));
base64ToUint8Array("AQID");
arrayBufferToBase64(new Uint8Array([1, 2, 3]).buffer);
```

```ts
isDomain("example.com"); // true
isEmail("user@example.com"); // true
```

```ts
const data = await tryCatchAsync(fetch("/api").then((r) => r.json()));
```

```ts
await preventTimeout(fetch("/api"), { timeout: 3000 });
```

```ts
computeWithDefinedParams([1, undefined], (a, b) => a + b, 0); // 0
```

### decorator (TS 5.0 新装饰器)

导入路径：`@zlikemario/helper/decorator`

```ts
import { Memoize } from "@zlikemario/helper/decorator";

class A {
  @Memoize(1000)
  calc(n: number) {
    return n * 2;
  }
}
```

### decorator-old (旧装饰器语法)

导入路径：`@zlikemario/helper/decorator-old`

```ts
import { Memoize } from "@zlikemario/helper/decorator-old";

class A {
  @Memoize(1000)
  calc(n: number) {
    return n * 2;
  }
}
```

### react

导入路径：`@zlikemario/helper/react`

```ts
import { useAsyncData, useCatchError, useLoadingEvent, useSyncedRef } from "@zlikemario/helper/react";
```

```ts
const [data, refresh] = useAsyncData(fetcher, { defaultData: [], onError: () => [] });
```

```ts
const run = useCatchError(exec, { target: "load", timeout: 5000, onError: console.error });
await run("id");
```

```ts
const [run, isLoading] = useLoadingEvent(exec, { isAllowMulticall: false });
```

```ts
const states = useSyncedRef({ execute, options });
```

### vue

导入路径：`@zlikemario/helper/vue`

```ts
import { useAsyncData, useCatchError, useLoadingEvent } from "@zlikemario/helper/vue";
```

```ts
const [data, refresh] = useAsyncData(fetcher, { defaultData: [], onError: () => [] });
```

```ts
const run = useCatchError(exec, { target: "load", timeout: 5000, onError: console.error });
await run("id");
```

```ts
const [run, isLoading] = useLoadingEvent(exec, { isAllowMulticall: false });
```

### types

导入路径：`@zlikemario/helper/types`

```ts
import type {
  Numberish,
  NumberString,
  MaybeNull,
  MaybeUndefined,
  MaybePromise,
  Defined,
  AnyFn,
  Noop,
} from "@zlikemario/helper/types";
```

## 4. 语义与行为约定

- 数字类函数统一接受 `Numberish`，无效输入通常返回 `String(num)`。
- 大数计算使用 `BigNumber`，避免浮点误差。
- `sum`/`sumBy` 返回字符串类型（`NumberString`），方便精度控制。
- `simplifyNumber` 的单位固定为 K/M/B，保留 1 位小数。
- `Memoize` 默认缓存 key 为第一个参数；可通过 `computeKey` 自定义。

## 5. 代码位置索引 (src)

- [src/number.ts](src/number.ts)
- [src/utils.ts](src/utils.ts)
- [src/decorator.ts](src/decorator.ts)
- [src/decorator-old.ts](src/decorator-old.ts)
- [src/react](src/react)
- [src/vue](src/vue)
- [src/types.ts](src/types.ts)

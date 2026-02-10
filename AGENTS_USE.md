# @zlikemario/helper · Agents Guide (Use)

> 面向“**使用这个库**”的 AI。
> 目标只有一个：**最少 token，最快定位方法，复制就能用。**

这不是给人类看的长文档，是给 AI 当工具箱索引用的。别抒情，直接干活。

---

## 1. 快速入口（先定位模块，再看示例）

- **默认入口**：`@zlikemario/helper`
  等价于：`@zlikemario/helper/number`

- **子路径入口**：
  - `/number`
  - `/utils`
  - `/decorator`
  - `/decorator-old`
  - `/react`
  - `/vue`
  - `/types`

AI 使用策略：

> 先判断问题属于哪个模块 → 直接跳子路径 → 找对应函数示例。

---

## 2. 方法速查（只列名字，用来“搜脑子”）

### number

`BigNumber` `trimFloatEndZero` `isComputableNumber` `unitFormat` `readabilityNumber` `toPercentage` `readableNumber` `sum` `sumBy`

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

`IntString` `DecimalsString` `Numberish` `NumberString` `MaybeNull` `MaybeUndefined` `MaybePromise` `Defined` `AnyFn` `Noop`

---

## 3. 用法速览（一函数一例，禁止废话）

### number

**导入路径**：`@zlikemario/helper/number`

```ts
import {
  BigNumber,
  trimFloatEndZero,
  isComputableNumber,
  unitFormat,
  readabilityNumber,
  toPercentage,
  readableNumber,
  sum,
  sumBy,
} from "@zlikemario/helper/number";
```

```ts
isComputableNumber("123");
isComputableNumber("12.3", true);
```

```ts
unitFormat(1234567); // "1.2M"
unitFormat("999", 2); // "999"
```

```ts
readabilityNumber(1234567.89); // "1,234,567.89"
```

```ts
toPercentage(0.1234); // "12.34%"
toPercentage(0.1234, 1, true); // "12.3"
```

```ts
trimFloatEndZero("1234.100100"); // "1234.1001"
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

---

### utils

**导入路径**：`@zlikemario/helper/utils`

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

---

### decorator（TS 5.x 新装饰器）

**导入路径**：`@zlikemario/helper/decorator`

```ts
import { Memoize } from "@zlikemario/helper/decorator";

class A {
  @Memoize(1000)
  calc(n: number) {
    return n * 2;
  }
}
```

---

### decorator-old（旧装饰器语法）

**导入路径**：`@zlikemario/helper/decorator-old`

```ts
import { Memoize } from "@zlikemario/helper/decorator-old";

class A {
  @Memoize(1000)
  calc(n: number) {
    return n * 2;
  }
}
```

---

### react

**导入路径**：`@zlikemario/helper/react`

```ts
import { useAsyncData, useCatchError, useLoadingEvent, useSyncedRef } from "@zlikemario/helper/react";
```

```ts
const [data, refresh] = useAsyncData(fetcher, {
  defaultData: [],
  onError: () => [],
});
```

```ts
const run = useCatchError(exec, {
  target: "load",
  timeout: 5000,
  onError: console.error,
});

await run("id");
```

```ts
const [run, isLoading] = useLoadingEvent(exec, { isAllowMulticall: false });
```

```ts
const states = useSyncedRef({ execute, options });
```

---

### vue

**导入路径**：`@zlikemario/helper/vue`

```ts
import { useAsyncData, useCatchError, useLoadingEvent } from "@zlikemario/helper/vue";
```

```ts
const [data, refresh] = useAsyncData(fetcher, {
  defaultData: [],
  onError: () => [],
});
```

```ts
const run = useCatchError(exec, {
  target: "load",
  timeout: 5000,
  onError: console.error,
});

await run("id");
```

```ts
const [run, isLoading] = useLoadingEvent(exec, { isAllowMulticall: false });
```

---

### types

**导入路径**：`@zlikemario/helper/types`

```ts
import type {
  IntString,
  DecimalsString,
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

---

## 4. 语义与行为约定（AI 必须遵守）

- 数字相关函数统一接受 `Numberish`
- 非法数字输入通常 **直接返回 `String(input)`**，不抛异常
- 所有高精度计算基于 `BigNumber`
- `sum` / `sumBy` **始终返回字符串**（`NumberString`）
- `unitFormat` 单位固定：`K / M / B`
- `Memoize`：
  - 默认 key = 第一个参数
  - 支持自定义 `computeKey`

---

## 5. 源码位置索引（用于深挖）

- `src/number.ts`
- `src/utils.ts`
- `src/decorator.ts`
- `src/decorator-old.ts`
- `src/react/*`
- `src/vue/*`
- `src/types.ts`

---

> 给 AI 的最后一句话：
> **别猜。按模块进，照例子抄。**

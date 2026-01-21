/**
 * 公共类型定义
 */

export type IntString = `${number}`;
export type DecimalsString = `${number}.${number}`;
export type NumberString = IntString | DecimalsString;
export type Numberish = NumberString | number | bigint;

export type MaybeNull<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type MaybePromise<T> = T | PromiseLike<T>;

export type Defined<T> = T extends undefined ? never : T;

export type AnyFn = (...args: any[]) => any;
export type Noop = () => void;

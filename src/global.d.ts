export {};

declare global {
  type NumberString = `${number}` | `${number}.${number}`;
  type Numberish = NumberString | string | bigint;

  type MaybeNull<T> = T | null;
  type MaybeUndefined<T> = T | undefined;
  type MaybePromise<T> = T | PromiseLike<T>;

  type Defined<T> = T extends undefined ? never : T;

  type AnyFn = (...args: any[]) => any;
  type Noop = () => void;
}

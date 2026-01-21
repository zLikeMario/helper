export {};

declare global {
  type IntString = `${number}`;
  type DecimalsString = `${number}.${number}`;
  type NumberString = IntString | DecimalsString;
  type Numberish = NumberString | number | bigint;

  type MaybeNull<T> = T | null;
  type MaybeUndefined<T> = T | undefined;
  type MaybePromise<T> = T | PromiseLike<T>;

  type Defined<T> = T extends undefined ? never : T;

  type AnyFn = (...args: any[]) => any;
  type Noop = () => void;
}

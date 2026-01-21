/**
 * 常用操作的工具函数集合
 */
import type { MaybeUndefined } from "./types";

/**
 * 延迟指定的时间间隔（毫秒）
 * @param interval - 延迟的毫秒数，默认 1500ms
 */
export const sleep = (interval = 1500) => new Promise<void>((resolve) => setTimeout(resolve, interval));

/**
 * 通过遮罩中间部分来加密字符串
 * @param text - 输入字符串
 * @param prefix - 开头保留的字符数
 * @param suffix - 结尾保留的字符数
 * @param placeholder - 遮罩字符串，默认 '...'
 * @returns 遮罩后的字符串
 */
export function encrypt(text: string, prefix = 4, suffix = 4, placeholder = "..."): string {
  if (!text || text.length <= prefix + suffix) return text;
  return text.slice(0, prefix) + placeholder + (suffix ? text.slice(-suffix) : "");
}

/**
 * 检查值是否为 undefined
 * @param v - 要检查的值
 */
export const isUndefined = (v: unknown): v is undefined => v === undefined;

/**
 * 检查提供的值中是否有任何一个为 undefined
 * @param vs - 要检查的值
 */
export const isHasUndefined = (...vs: unknown[]) => vs.some(isUndefined);

/**
 * 检查值是否为 Promise
 * @param v - 要检查的值
 */
export const isPromise = <T = any>(v: unknown): v is Promise<T> =>
  !!v && typeof (v as any)?.then === "function" && typeof (v as any)?.catch === "function";

/**
 * 将 Uint8Array 转换为 Base64 字符串
 * @param array - 要转换的 Uint8Array
 */
export function uint8ArrayToBase64(array: Uint8Array): string {
  // 如果可用，使用 TextDecoder 提高性能，否则使用 reduce
  let binaryString = "";
  for (let i = 0; i < array.length; i++) {
    binaryString += String.fromCharCode(array[i]);
  }
  return btoa(binaryString);
}

/**
 * 将 Base64 字符串转换为 Uint8Array
 * @param base64 - 要转换的 Base64 字符串
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    array[i] = binaryString.charCodeAt(i);
  }
  return array;
}

/**
 * 将 ArrayBuffer 转换为 Base64 字符串
 * @param buffer - 要转换的 ArrayBuffer
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return uint8ArrayToBase64(new Uint8Array(buffer));
}

/**
 * 验证域名
 * 规则：
 * 1. 只允许数字、字母和连字符
 * 2. 由一个或多个用点分隔的部分组成
 * 3. 最后一部分必须至少有两个字符
 * 4. 不能以连字符开头或结尾
 * 5. 不能有连续的连字符或连字符-点/点-连字符
 * @param text - 要验证的域名字符串
 */
export function isDomain(text: string): boolean {
  if (typeof text !== "string") return false;
  text = text.toLowerCase();
  if (!/^[0-9a-z.\-]+$/.test(text)) return false;
  if (text.includes("--") || text.includes("-.") || text.includes(".-") || text.startsWith("-") || text.endsWith("-"))
    return false;
  const parts = text.split(".");
  if (parts.length < 2) return false;
  if (parts.some((part) => !part.length)) return false;
  if (parts[parts.length - 1].length < 2) return false;
  return true;
}

/**
 * 验证电子邮件地址
 * 规则：
 * 1. 账户部分：允许字母、数字、_、-、.
 * 2. 不能以点开头或结尾
 * 3. 不能有连续的特殊字符
 * 4. 特殊字符后必须至少跟一个字母或数字
 * 5. 域名部分必须有效
 * @param text - 要验证的电子邮件字符串
 */
export function isEmail(text: string): boolean {
  const [account, ...domains] = text.toLowerCase().split("@");
  if (!account || !domains.length) return false;
  if (!/^[a-z0-9._-]+$/.test(account)) return false;
  if (/^\.|\.$/.test(account)) return false;
  if (/[.\-_]{2,}/.test(account)) return false;
  if (/[.\-_](?![a-z0-9])/.test(account)) return false;
  for (const domain of domains) {
    if (!isDomain(domain)) return false;
  }
  return true;
}

/**
 * 异步 try-catch 包装器
 * @param p - 要执行的 Promise
 * @param catchFn - 可选的错误处理函数
 */
export const tryCatchAsync = async <T, FR = any, F extends ((error: unknown) => FR) | undefined = undefined>(
  p: Promise<T>,
  catchFn?: F,
): Promise<T | (F extends Function ? FR : undefined)> => {
  try {
    return await p;
  } catch (error) {
    return catchFn?.(error) as F extends Function ? FR : undefined;
  }
};

/**
 * 执行回调函数或 Promise，并确保在指定的超时时间内完成
 * 如果操作未能及时完成，返回的 Promise 将以超时错误被拒绝
 *
 * @template R 解析值的类型
 * @param callback - 返回 Promise 的函数或要执行的 Promise
 * @param options - 超时行为的可选设置
 * @param options.errorMessage - 超时拒绝的自定义错误消息，默认为 "Timeout"
 * @param options.duration - 超时时间（毫秒），默认为 15000 ms
 * @returns 一个 Promise，解析为回调的结果或在达到超时时拒绝
 */
export async function preventTimeout<R>(
  callback: (() => Promise<R>) | Promise<R>,
  options?: {
    errorMessage?: string;
    timeoutError?: any;
    timeout?: number;
  },
): Promise<R> {
  const { errorMessage = "Timeout", timeoutError, timeout = 15000 } = options || {};
  const cbPromise = typeof callback === "function" ? (callback as () => Promise<R>)() : callback;
  const timeoutPromise = new Promise<R>((_, reject) =>
    setTimeout(() => reject(timeoutError ? timeoutError : new Error(errorMessage)), timeout),
  );
  return Promise.race([cbPromise, timeoutPromise]);
}

export type ParamsWithMaybeUndefined<T extends readonly unknown[]> = { [K in keyof T]: T[K] | undefined };
export const computeWithDefinedParams = <T extends readonly unknown[], R, StandbyR extends MaybeUndefined<R>>(
  params: ParamsWithMaybeUndefined<T>,
  compute: (...args: T) => R,
  standby?: StandbyR,
): StandbyR extends undefined ? MaybeUndefined<R> : R => {
  return params.some(isUndefined) ? (standby as R) : compute(...(params as T));
};

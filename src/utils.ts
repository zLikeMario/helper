/**
 * Utility functions for common operations.
 */

/**
 * Sleep for a specified interval (ms).
 * @param interval - Time in milliseconds to sleep. Default: 1500ms.
 */
export const sleep = (interval = 1500) => new Promise<void>((resolve) => setTimeout(resolve, interval));

/**
 * Encrypts a string by masking the middle part.
 * @param text - The input string.
 * @param prefix - Number of characters to keep at the start.
 * @param suffix - Number of characters to keep at the end.
 * @param placeholder - Masking string. Default: '...'.
 * @returns Masked string.
 */
export function encrypt(text: string, prefix = 4, suffix = 4, placeholder = "..."): string {
  if (!text || text.length <= prefix + suffix) return text;
  return text.slice(0, prefix) + placeholder + (suffix ? text.slice(-suffix) : "");
}

/**
 * Checks if a value is undefined.
 * @param v - Value to check.
 */
export const isUndefined = (v: unknown): v is undefined => v === undefined;

/**
 * Checks if any of the provided values are undefined.
 * @param vs - Values to check.
 */
export const isHasUndefined = (...vs: unknown[]) => vs.some(isUndefined);

/**
 * Checks if a value is a Promise.
 * @param v - Value to check.
 */
export const isPromise = <T = any>(v: unknown): v is Promise<T> =>
  !!v && typeof (v as any)?.then === "function" && typeof (v as any)?.catch === "function";

/**
 * Converts a Uint8Array to a Base64 string.
 * @param array - Uint8Array to convert.
 */
export function uint8ArrayToBase64(array: Uint8Array): string {
  // Use TextDecoder if available for performance, fallback to reduce
  let binaryString = "";
  for (let i = 0; i < array.length; i++) {
    binaryString += String.fromCharCode(array[i]);
  }
  return btoa(binaryString);
}

/**
 * Converts a Base64 string to a Uint8Array.
 * @param base64 - Base64 string to convert.
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
 * Converts an ArrayBuffer to a Base64 string.
 * @param buffer - ArrayBuffer to convert.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return uint8ArrayToBase64(new Uint8Array(buffer));
}

/**
 * Validates a domain name.
 * Rules:
 * 1. Only numbers, letters, and hyphens allowed.
 * 2. Composed of one or more parts separated by dots.
 * 3. Last part must be at least two characters.
 * 4. Cannot start or end with a hyphen.
 * 5. No consecutive hyphens or hyphen-dot/dot-hyphen.
 * @param text - Domain string to validate.
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
 * Validates an email address.
 * Rules:
 * 1. Account part: letters, numbers, _, -, . allowed.
 * 2. No leading/trailing dot.
 * 3. No consecutive special characters.
 * 4. Special character must be followed by at least one letter/number.
 * 5. Domain part must be valid.
 * @param text - Email string to validate.
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
 * Async try-catch wrapper.
 * @param p - Promise to execute.
 * @param catchFn - Optional error handler.
 */
export const tryCatchAsync = async <T, F extends ((error: unknown) => any) | undefined = undefined>(
  p: Promise<T>,
  catchFn?: F
): Promise<T | (F extends (...args: any) => any ? ReturnType<F> : undefined)> => {
  try {
    return await p;
  } catch (error) {
    return catchFn?.(error);
  }
};

/**
 * Executes a callback or promise and ensures it completes within a specified timeout duration.
 * If the operation does not finish in time, the returned promise is rejected with a timeout error.
 *
 * @template R The type of the resolved value.
 * @param callback - A function returning a promise or a promise to execute.
 * @param options - Optional settings for timeout behavior.
 * @param options.errorMessage - Custom error message for timeout rejection. Defaults to "Timeout".
 * @param options.duration - Timeout duration in milliseconds. Defaults to 15000 ms.
 * @returns A promise that resolves with the result of the callback or rejects if the timeout is reached.
 */
export async function preventTimeout<R>(
  callback: (() => Promise<R>) | Promise<R>,
  options?: {
    errorMessage?: string;
    duration?: number;
  }
): Promise<R> {
  const { errorMessage = "Timeout", duration = 15000 } = options || {};
  const cbPromise = typeof callback === "function" ? (callback as () => Promise<R>)() : callback;
  const timeoutPromise = new Promise<R>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), duration));
  return Promise.race([cbPromise, timeoutPromise]);
}

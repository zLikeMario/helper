import { describe, expect, test } from "vitest";
import {
  encrypt,
  isUndefined,
  sleep,
  isHasUndefined,
  isPromise,
  uint8ArrayToBase64,
  base64ToUint8Array,
  arrayBufferToBase64,
} from "./utils";

describe("utils.ts", () => {
  const testCases: [string, string, number, number, string][] = [
    ["12345678", "12...78", 2, 2, "encrypt with prefix 2 and suffix 2"],
    ["123", "123", 2, 2, "encrypt short string"],
    ["", "", 2, 2, "encrypt empty string"],
    ["12345678", "1234...", 4, 0, "encrypt with prefix 4 and no suffix"],
  ];
  testCases.forEach(([input, expected, prefix, suffix, desc]) => {
    test(`encrypt: ${desc}`, () => {
      expect(encrypt(input, prefix, suffix)).toBe(expected);
    });
  });

  const undefinedCases: [any, boolean][] = [
    [undefined, true],
    [null, false],
    [0, false],
    ["", false],
  ];
  undefinedCases.forEach(([input, expected]) => {
    test(`isUndefined: ${input} => ${expected}`, () => {
      expect(isUndefined(input)).toBe(expected);
    });
  });

  test("sleep", async () => {
    const start = Date.now();
    await sleep(50);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(50);
  });

  test("isHasUndefined", () => {
    expect(isHasUndefined(1, undefined, 3)).toBe(true);
    expect(isHasUndefined(1, 2, 3)).toBe(false);
  });

  test("isPromise", () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise(123)).toBe(false);
  });

  test("uint8ArrayToBase64/base64ToUint8Array", () => {
    const arr = new Uint8Array([72, 101, 108, 108, 111]);
    const b64 = uint8ArrayToBase64(arr);
    expect(b64).toBe(btoa("Hello"));
    const arr2 = base64ToUint8Array(b64);
    expect(Array.from(arr2)).toEqual([72, 101, 108, 108, 111]);
  });

  test("arrayBufferToBase64", () => {
    const buf = new Uint8Array([65, 66, 67]).buffer;
    expect(arrayBufferToBase64(buf)).toBe(btoa("ABC"));
  });
});

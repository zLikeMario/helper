import { describe, expect, test } from "vitest";
import { readableNumber, isNumber, simplifyNumber, BigNumber } from "./number";

describe("number.ts", () => {
  const valueAndExpect = [
    ["0.000000001214151168", "0.0{8}12"],
    ["-0.000000001214151168", "-0.0{8}12"],
    ["0.00", "0"],
    ["", ""],
    ["3.000000000000006e-17", "0.0{16}3"],
    ["0.00000000000000000001", "0.0{19}1"],
    ["0.0000000000000000000100", "0.0{19}1"],
    ["1000000000000000.0000000000000000000100", "1,000,000,000,000,000.0{19}1"],
    ["-1000000000000000.0000000000000000000100", "-1,000,000,000,000,000.0{19}1"],
    ["abc", "abc"],
    ["1e1", "10"],
    ["123456aa", "123456aa"],
  ];
  valueAndExpect.forEach(([v, r]) => {
    test(`readableNumber: ${v} => ${r}`, () => {
      expect(readableNumber(v)).toBe(r);
    });
  });

  test("isNumber: 正常数字", () => {
    expect(isNumber("123")).toBe(true);
    expect(isNumber(123)).toBe(true);
    expect(isNumber("-123.45")).toBe(true);
    expect(isNumber("abc")).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber("123", true)).toBe(true);
    expect(isNumber("123.45", true)).toBe(false);
  });

  test("simplifyNumber: 千分位和单位", () => {
    expect(simplifyNumber(1234)).toMatch(/K$/);
    expect(simplifyNumber(-1234)).toMatch(/K$/);
    expect(simplifyNumber(1000000)).toMatch(/M$/);
    expect(simplifyNumber("abc")).toBe("abc");
    // @ts-expect-error 测试传入 undefined
    expect(simplifyNumber(undefined)).toBe("undefined");
  });

  test("BigNumber 导出", () => {
    expect(typeof BigNumber).toBe("function");
    const bn = new BigNumber("123.456");
    expect(bn.toFixed()).toBe("123.456");
  });
});

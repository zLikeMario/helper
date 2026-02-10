import { describe, expect, test } from "vitest";
import { readableNumber, isComputableNumber, unitFormat, BigNumber } from "./number";

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
      expect(readableNumber(v as any)).toBe(r);
    });
  });

  test("isComputableNumber: 正常数字", () => {
    expect(isComputableNumber("123")).toBe(true);
    expect(isComputableNumber(123)).toBe(true);
    expect(isComputableNumber("-123.45")).toBe(true);
    expect(isComputableNumber("abc")).toBe(false);
    expect(isComputableNumber(undefined)).toBe(false);
    expect(isComputableNumber("123", true)).toBe(true);
    expect(isComputableNumber("123.45", true)).toBe(false);
  });

  test("unitFormat: 千分位和单位", () => {
    expect(unitFormat(1234)).toMatch(/K$/);
    expect(unitFormat(-1234)).toMatch(/K$/);
    expect(unitFormat(1000000)).toMatch(/M$/);
    expect(unitFormat("abc" as any)).toBe("abc");
    expect(unitFormat("999.999")).toBe("999.999");
    // @ts-expect-error 测试传入 undefined
    expect(unitFormat(undefined)).toBe("undefined");
  });

  test("BigNumber 导出", () => {
    expect(typeof BigNumber).toBe("function");
    const bn = new BigNumber("123.456");
    expect(bn.toFixed()).toBe("123.456");
  });
});

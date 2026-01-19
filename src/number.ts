/**
 * 数字相关工具函数
 */
import BigNumber from "bignumber.js";

// 配置 BigNumber，避免科学计数法
BigNumber.config({ EXPONENTIAL_AT: 99 });

export { BigNumber };
export default BigNumber;

/**
 * 判断是否为有效数字
 * @param num - 待判断的值
 * @param isInt - 是否要求为整数
 * @returns 是否为数字
 */
export function isNumber(num: any, isInt = false): boolean {
  if (!["string", "number", "bigint"].includes(typeof num)) return false;
  try {
    num = BigNumber(num).toFixed();
  } catch {
    return false;
  }
  return isInt ? /^-?\d+$/.test(num) : /^-?\d+(\.\d+)?$/.test(num);
}

/**
 * 数字简化显示（如 1.2K, 3.4M）
 * @param num - 数字
 * @param decimal - 保留小数位
 * @param rm - 舍入模式
 * @returns 简化后的字符串
 */
export function simplifyNumber(
  num: Numberish,
  decimal = 3,
  rm: BigNumber.RoundingMode = BigNumber.ROUND_HALF_UP,
): string {
  if (!isNumber(num)) return String(num);
  const size = 1000;
  let bignumber = BigNumber(num);
  if (bignumber.abs().lt(size)) return bignumber.toFixed(decimal, rm).replace(/\.0+$/, "");

  const unit = ["", "K", "M", "B"];
  let i = 0;
  while (++i < unit.length) {
    bignumber = bignumber.div(size);
    if (bignumber.abs().lt(size)) break;
  }
  return bignumber.toFixed(1, rm) + unit[i];
}

/**
 * 数字千分位分隔显示
 * @param num - 数字
 * @returns 格式化后的字符串
 */
export function readabilityNumber(num: Numberish): string {
  if (!isNumber(num)) return String(num);
  return BigNumber(num).toFormat({
    decimalSeparator: ".",
    groupSeparator: ",",
    groupSize: 3,
  });
}

/**
 * 转为百分比字符串
 * @param num - 数字
 * @param precision - 保留小数位
 * @param isHiddenUnit - 是否隐藏百分号
 * @returns 百分比字符串
 */
export function toPercentage(num: Numberish, precision = 2, isHiddenUnit = false): string {
  if (!isNumber(num)) return String(num);
  const value = BigNumber(num).times(100).toFixed(precision);
  return parseFloat(value) + (isHiddenUnit ? "" : "%");
}

/**
 * 保留指定精度
 * @param num - 数字
 * @param precision - 保留小数位
 * @returns 格式化后的字符串
 */
export function formatPrecision(num: Numberish, precision = 4): string {
  if (!isNumber(num)) return String(num);
  return BigNumber(num).dp(precision).toString();
}

/**
 * 高级可读性数字格式化（如 1,234.0{4}1）
 * @param number - 数字
 * @param decimals - 保留小数位
 * @returns 格式化后的字符串
 */
export const readableNumber = (number: Numberish, decimals = 4): string => {
  if (!isNumber(number)) return String(number);
  const match = BigNumber(number)
    .toFixed()
    .match(/(-?)(\d+)\.(0+)(\d+)/);
  if (!match) {
    return readabilityNumber(BigNumber(number).dp(decimals).toFixed());
  }
  const [, sign, int, zeros, nums] = match;
  return zeros.length > 3
    ? `${sign}${readabilityNumber(int)}.0{${zeros.length}}${nums.slice(0, decimals - 2).replace(/0+$/, "")}`
    : `${sign}${readabilityNumber(int)}.${zeros}${nums.slice(0, decimals - 2).replace(/0+$/, "")}`;
};

/**
 * 数组求和
 * @param data - 数字数组
 * @returns 求和结果字符串
 */
export const sum = (data: Array<Numberish>) => {
  return data.reduce<BigNumber>((sum, item) => sum.plus(item), BigNumber(0)).toString() as NumberString;
};

/**
 * 按 key 或函数求和
 * @param data - 对象数组
 * @param key - 属性名或函数
 * @returns 求和结果字符串
 */
export function sumBy<T, K extends keyof T>(
  data: T[],
  key: T[K] extends MaybeUndefined<Numberish> ? K : never,
): NumberString;
export function sumBy<T>(data: T[], key: (item: T) => Numberish): NumberString;
export function sumBy<T, K extends keyof T>(data: T[], key: K | ((item: T) => Numberish)): NumberString {
  const getValue = typeof key === "function" ? (item: T) => key(item) : (item: T) => item?.[key as keyof T] ?? "0";
  return data.reduce((sum, item) => sum.plus(getValue(item) as Numberish), BigNumber(0)).toString() as NumberString;
}

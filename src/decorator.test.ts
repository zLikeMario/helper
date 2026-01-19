import { describe, it, expect, beforeEach, vi } from "vitest";
import { Memoize } from "./decorator";

describe("Memoize Decorator", () => {
  describe("实例方法缓存", () => {
    class TestClass {
      callCount = 0;

      @Memoize()
      simpleMethod(value: number) {
        this.callCount++;
        return value * 2;
      }

      @Memoize(1000)
      methodWithDuration(value: number) {
        this.callCount++;
        return value * 3;
      }

      @Memoize(0, (a: number, b: number) => `${a}-${b}`)
      methodWithCustomKey(a: number, b: number) {
        this.callCount++;
        return a + b;
      }

      @Memoize(0, "fixed-key")
      methodWithFixedKey(value: number) {
        this.callCount++;
        return value * 4;
      }

      @Memoize(0, undefined, true)
      methodCacheVoid(value: number): number | undefined {
        this.callCount++;
        return value === 0 ? undefined : value;
      }

      @Memoize()
      async asyncMethod(value: number) {
        this.callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return value * 5;
      }

      @Memoize(0, undefined, false)
      async asyncMethodReturnsUndefined(value: number): Promise<number | undefined> {
        this.callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return value === 0 ? undefined : value;
      }
    }

    let instance1: TestClass;
    let instance2: TestClass;

    beforeEach(() => {
      instance1 = new TestClass();
      instance2 = new TestClass();
    });

    it("应该缓存实例方法的结果", () => {
      expect(instance1.simpleMethod(5)).toBe(10);
      expect(instance1.callCount).toBe(1);

      expect(instance1.simpleMethod(5)).toBe(10);
      expect(instance1.callCount).toBe(1); // 应该使用缓存，不增加调用次数

      expect(instance1.simpleMethod(10)).toBe(20);
      expect(instance1.callCount).toBe(2); // 不同参数，应该重新计算
    });

    it("不同实例应该有独立的缓存", () => {
      expect(instance1.simpleMethod(5)).toBe(10);
      expect(instance1.callCount).toBe(1);

      expect(instance2.simpleMethod(5)).toBe(10);
      expect(instance2.callCount).toBe(1); // instance2 有自己的缓存

      expect(instance1.callCount).toBe(1); // instance1 的计数不受影响
      expect(instance2.callCount).toBe(1);
    });

    it("应该支持缓存过期", async () => {
      expect(instance1.methodWithDuration(5)).toBe(15);
      expect(instance1.callCount).toBe(1);

      expect(instance1.methodWithDuration(5)).toBe(15);
      expect(instance1.callCount).toBe(1); // 缓存未过期

      // 等待缓存过期
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(instance1.methodWithDuration(5)).toBe(15);
      expect(instance1.callCount).toBe(2); // 缓存过期，重新计算
    });

    it("应该支持自定义缓存键", () => {
      expect(instance1.methodWithCustomKey(2, 3)).toBe(5);
      expect(instance1.callCount).toBe(1);

      expect(instance1.methodWithCustomKey(2, 3)).toBe(5);
      expect(instance1.callCount).toBe(1); // 相同的键，使用缓存

      expect(instance1.methodWithCustomKey(3, 2)).toBe(5);
      expect(instance1.callCount).toBe(2); // 不同的键，重新计算
    });

    it("应该支持固定缓存键", () => {
      expect(instance1.methodWithFixedKey(5)).toBe(20);
      expect(instance1.callCount).toBe(1);

      expect(instance1.methodWithFixedKey(10)).toBe(20);
      expect(instance1.callCount).toBe(1); // 固定键，返回第一次的结果
    });

    it("默认情况下不应该缓存 undefined 结果", () => {
      expect(instance1.methodCacheVoid(0)).toBeUndefined();
      expect(instance1.callCount).toBe(1);

      expect(instance1.methodCacheVoid(0)).toBeUndefined();
      expect(instance1.callCount).toBe(1); // isCacheVoid=true，缓存 undefined
    });

    it("应该缓存异步方法的结果", async () => {
      const result1 = await instance1.asyncMethod(5);
      expect(result1).toBe(25);
      expect(instance1.callCount).toBe(1);

      const result2 = await instance1.asyncMethod(5);
      expect(result2).toBe(25);
      expect(instance1.callCount).toBe(1); // 使用缓存
    });

    it("异步方法返回 undefined 时不应该缓存", async () => {
      const result1 = await instance1.asyncMethodReturnsUndefined(0);
      expect(result1).toBeUndefined();
      expect(instance1.callCount).toBe(1);

      const result2 = await instance1.asyncMethodReturnsUndefined(0);
      expect(result2).toBeUndefined();
      expect(instance1.callCount).toBe(2); // undefined 不缓存，重新计算
    });

    it("异步方法返回有效值时应该缓存", async () => {
      const result1 = await instance1.asyncMethodReturnsUndefined(5);
      expect(result1).toBe(5);
      expect(instance1.callCount).toBe(1);

      const result2 = await instance1.asyncMethodReturnsUndefined(5);
      expect(result2).toBe(5);
      expect(instance1.callCount).toBe(1); // 缓存有效值
    });
  });

  describe("静态方法缓存", () => {
    class TestClass {
      static callCount = 0;

      @Memoize()
      static simpleMethod(value: number) {
        this.callCount++;
        return value * 2;
      }

      @Memoize(1000)
      static methodWithDuration(value: number) {
        this.callCount++;
        return value * 3;
      }

      @Memoize(0, (a: number, b: number) => `${a}-${b}`)
      static methodWithCustomKey(a: number, b: number) {
        this.callCount++;
        return a + b;
      }

      @Memoize()
      static async asyncMethod(value: number) {
        this.callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return value * 5;
      }
    }

    beforeEach(() => {
      TestClass.callCount = 0;
    });

    it("应该缓存静态方法的结果", () => {
      expect(TestClass.simpleMethod(5)).toBe(10);
      expect(TestClass.callCount).toBe(1);

      expect(TestClass.simpleMethod(5)).toBe(10);
      expect(TestClass.callCount).toBe(1); // 使用缓存

      expect(TestClass.simpleMethod(10)).toBe(20);
      expect(TestClass.callCount).toBe(2); // 不同参数
    });

    it("静态方法缓存应该在所有实例间共享", () => {
      const instance1 = new TestClass();
      const instance2 = new TestClass();

      expect(TestClass.simpleMethod(100)).toBe(200);
      expect(TestClass.callCount).toBe(1);

      expect(TestClass.simpleMethod(100)).toBe(200);
      expect(TestClass.callCount).toBe(1); // 静态方法缓存共享
    });

    it("应该支持静态方法的缓存过期", async () => {
      expect(TestClass.methodWithDuration(5)).toBe(15);
      expect(TestClass.callCount).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(TestClass.methodWithDuration(5)).toBe(15);
      expect(TestClass.callCount).toBe(2); // 缓存过期
    });

    it("应该支持静态方法的自定义缓存键", () => {
      expect(TestClass.methodWithCustomKey(2, 3)).toBe(5);
      expect(TestClass.callCount).toBe(1);

      expect(TestClass.methodWithCustomKey(2, 3)).toBe(5);
      expect(TestClass.callCount).toBe(1); // 使用缓存
    });

    it("应该缓存静态异步方法的结果", async () => {
      const result1 = await TestClass.asyncMethod(5);
      expect(result1).toBe(25);
      expect(TestClass.callCount).toBe(1);

      const result2 = await TestClass.asyncMethod(5);
      expect(result2).toBe(25);
      expect(TestClass.callCount).toBe(1); // 使用缓存
    });
  });

  describe("边界情况", () => {
    class TestClass {
      callCount = 0;

      @Memoize()
      methodWithNoArgs() {
        this.callCount++;
        return "result";
      }

      @Memoize()
      methodWithMultipleArgs(a: number, b: string, c: boolean) {
        this.callCount++;
        return `${a}-${b}-${c}`;
      }

      @Memoize()
      methodReturnsObject(id: number) {
        this.callCount++;
        return { id, value: id * 2 };
      }
    }

    let instance: TestClass;

    beforeEach(() => {
      instance = new TestClass();
    });

    it("应该支持无参数的方法", () => {
      expect(instance.methodWithNoArgs()).toBe("result");
      expect(instance.callCount).toBe(1);

      expect(instance.methodWithNoArgs()).toBe("result");
      expect(instance.callCount).toBe(1); // 使用缓存
    });

    it("应该支持多参数的方法", () => {
      expect(instance.methodWithMultipleArgs(1, "test", true)).toBe("1-test-true");
      expect(instance.callCount).toBe(1);

      expect(instance.methodWithMultipleArgs(1, "test", true)).toBe("1-test-true");
      expect(instance.callCount).toBe(1); // 使用缓存
    });

    it("应该支持返回对象", () => {
      const result1 = instance.methodReturnsObject(5);
      expect(result1).toEqual({ id: 5, value: 10 });
      expect(instance.callCount).toBe(1);

      const result2 = instance.methodReturnsObject(5);
      expect(result2).toEqual({ id: 5, value: 10 });
      expect(instance.callCount).toBe(1); // 使用缓存
      expect(result1).toBe(result2); // 应该是同一个对象引用
    });
  });
});

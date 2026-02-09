# @zlikemario/helper - Agents Guide

本文件面向 AI 代理，说明这个库做什么、如何使用，以及改动时的约定。

## 1. 项目定位

- 这是一个 TypeScript 工具库，提供数字处理、常用工具函数、装饰器，以及 React/Vue 的 hooks。
- 以 ESM 为主（package.json 的 `type: module`）。
- 主要入口是 `@zlikemario/helper/number`，其他入口通过子路径导出。

## 2. 构建与测试

- `yarn build`：Vite 构建 + 仅生成声明文件。
- `yarn test`：使用 Vitest。

## 3. AI 修改指导

- 新增模块时，需要更新 exports 与类型导出，保持子路径一致。
- 若新增 hook，请在对应的 `src/react/index.ts` 或 `src/vue/index.ts` 导出。
- 保持函数纯度与输入容错风格一致（数值校验优先用 `isNumber`）。
- 避免破坏已有返回类型（尤其是字符串格式化输出）。

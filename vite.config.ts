import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        "vue": resolve(__dirname, "src/vue.ts"),
        "react": resolve(__dirname, "src/react.ts"),
        "decorator": resolve(__dirname, "src/decorator.ts"),
        "decorator-old": resolve(__dirname, "src/decorator-old.ts"),
        "number": resolve(__dirname, "src/number.ts"),
        "utils": resolve(__dirname, "src/utils.ts"),
      },
      name: "zmario",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["bignumber.js", "dayjs", "vue", "react"],
      output: {
        preserveModules: false,
        exports: "named",
      },
    },
  },
});

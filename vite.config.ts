import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: {
        number: resolve(__dirname, "src/number.ts"),
        utils: resolve(__dirname, "src/utils.ts"),
      },
      name: "zmario",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["bignumber.js", "dayjs"],
      output: {
        preserveModules: false,
        exports: "named",
      },
    },
  },
});

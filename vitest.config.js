import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		setupFiles: "./test/vitest-setup.js",
		include: ["src/**/*.test.js?(x)"],
	},
});

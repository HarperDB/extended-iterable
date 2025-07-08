import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		allowOnly: true,
		coverage: {
			include: ['src/**/*.ts'],
			reporter: ['html', 'lcov', 'text']
		},
		environment: 'node',
		globals: false,
		include: ['test/**/*.test.ts'],
		pool: 'threads',
		reporters: ['verbose'],
		watch: false
	}
});
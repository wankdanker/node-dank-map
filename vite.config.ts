import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
	plugins: [dts({ bundleTypes: true })],
	build: {
		lib: {
			entry: `${__dirname}src/index.ts`,
			name: 'dankMap',
			fileName: (format) => (format === 'cjs' ? 'index.cjs' : 'index.js'),
			formats: ['es', 'cjs'],
		},
	},
	test: {
		include: ['test/**/*.test.ts'],
	},
})

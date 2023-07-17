import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import nodePolyfills from "rollup-plugin-polyfill-node"

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	build: {
		rollupOptions: {
			plugins: [nodePolyfills()],
		},
		minify: true,
		sourcemap: true,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	}
});

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import nodePolyfills from "rollup-plugin-polyfill-node"
import EntryShakingPlugin from 'vite-plugin-entry-shaking'

export default defineConfig({
	plugins: [
		sveltekit(),
		await EntryShakingPlugin({
			targets: ['@tabler/icons-svelte'],
			extensions: ['svelte'],
		}),
	],
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

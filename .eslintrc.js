module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'plugin:nuxt/recommended',
		'prettier',
	],
	plugins: [],
	// add your custom rules here
	rules: {
		'comma-dange': ['error', 'always-multiline'],
		'import/first': 'off',
		'import/order': 'off',
		ident: 'off',
		'@typescript-eslint/ident': ['error', 'tab'],
		'no-new': 'off',
		'no-tabs': 'off',
		semi: ['error', 'always'],
		'vue/html-ident': ['error', 'tab'],
		'vue/order-in-components': 'off',
	},
}

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'event-tracker/event-server/tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {},
};

module.exports = {
	root: true,
	env: {
		browser: true,
		jest: true,
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
			warnOnUnsupportedTypeScriptVersion: false,
		},
		ecmaVersion: 7,
		project: './tsconfig.lint.json',
		sourceType: 'module',
	},
	plugins: [
		'@typescript-eslint',
		'css-modules',
		'import',
		'prettierx',
		'react',
		'react-hooks',
	],
	settings: {
		prettierx: {
			usePrettierrc: true,
		},
		react: {
			version: 'detect',
		},
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:css-modules/recommended',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:import/warnings',
		'plugin:prettierx/@typescript-eslint',
		'plugin:prettierx/react',
		'plugin:prettierx/standardx',
		'plugin:react/recommended',
		'plugin:you-dont-need-momentjs/recommended',
	],
	rules: {
		'prettierx/options': [
			2,
			{
				alignObjectProperties: false,
				jsxSingleQuote: false,
				semi: true,
				singleQuote: true,
				spaceBeforeFunctionParen: true,
				trailingComma: 'all',
				useTabs: true,
			},
		],
		'linebreak-style': 'off',
		'no-console': 'off',
		'no-constant-condition': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				varsIgnorePattern: 'UU',
				args: 'none',
			},
		],
		'no-useless-catch': 'off',
		quotes: 'off',
		semi: ['error', 'always'],
		curly: ['error', 'multi-line'],
		'import/named': 2,
		'import/order': ['error', {
			'newlines-between': 'always'
		}],
		'import/no-unresolved': ['warn'],
		'one-var': ['error', 'never'],
		'no-var': 'error',
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: '*',
				next: 'return',
			},
			{
				blankLine: 'always',
				prev: ['const', 'let', 'var'],
				next: '*',
			},
			{
				blankLine: 'any',
				prev: ['const', 'let', 'var'],
				next: ['const', 'let', 'var'],
			},
			{
				blankLine: 'always',
				prev: ['block', 'block-like', 'if'],
				next: '*',
			},
			{
				blankLine: 'always',
				prev: '*',
				next: ['block', 'block-like', 'if'],
			},
			{
				blankLine: 'any',
				prev: 'export',
				next: '*',
			},
			{
				blankLine: 'any',
				prev: '*',
				next: 'export',
			},
		],
		'react/no-danger': 'off',
		'react/no-find-dom-node': 'off',
		'react/jsx-filename-extension': [
			1,
			{
				extensions: ['.tsx', '.jsx'],
			},
		],
		'react/prop-types': [0],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/prefer-interface': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
	},
};

console.log('Running PurgeCSS...');

module.exports = {
	plugins: [
		'postcss-flexbugs-fixes',
		[
			'postcss-preset-env',
			{
				autoprefixer: {
					flexbox: 'no-2009',
				},
				stage: 3,
				features: {
					'custom-properties': false,
				},
			},
		],
		[
			'@fullhuman/postcss-purgecss',
			{
				blocklist: [],
				content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
				defaultExtractor: content => content.match(/\b[a-z][a-z0-9-]+[a-z0-9]\b/g) || [],
				fontFace: true,
				keyframes: true,
				rejected: true,
				safelist: ['html', 'body', '__next'],
			},
		],
	],
};

module.exports = {
	async rewrites () {
		return [
			{
				destination: '/users/edit',
				source: '/users/create',
			},
		];
	},
};

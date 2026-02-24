const { resolve } = require('path');

module.exports = {
	plugins: {
		'@pandacss/dev/postcss': {
			configPath: resolve(__dirname, 'panda.config.ts'),
		},
	},
};

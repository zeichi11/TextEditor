const path = require('path');

module.exports = {
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: path.resolve(__dirname, 'src/main'),
				query: {
					cacheDirectory: true,
					presets: [
						'@babel/env'
					]
					// presets: [
					// 	'@babel/preset-env'
					// ]
				}
			}
		]
	}
};
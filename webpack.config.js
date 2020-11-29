const CommonConfig = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const yargs = require("yargs");

module.exports = () => {
	const argv = yargs.argv;
	const envConfig = require(`./webpack.${argv.env}.js`);
	// const envConfig = require(`webpack/webpack.dev.js`);

console.log(argv.env);
console.log(envConfig);


const a = merge(envConfig, CommonConfig);
console.log(a);

	return a;
};

// const path = require('path');
//
// module.exports = {
// 	entry: './src/main/index.js',
//
// 	devServer: {
// 		hot: true,
// 		inline: true,
// 		host: '0.0.0.0',
// 		port: 9000,
// 		contentBase: __dirname + '/public'
// 	},
// 	devtool: "source-map",
//
// 	output: {
// 		path: path.join(__dirname, 'public'),
// 		filename: 'bundle.js'
// 	},
//
// 	module: {
// 		rules: [
// 			{
// 				test: /\.js?$/,
// 				loader: 'babel-loader',
// 				exclude: /node_modules/,
// 				include: path.resolve(__dirname, 'src/main'),
// 				query: {
// 					cacheDirectory: true,
// 					presets: [
// 						'@babel/env'
// 					]
// 					// presets: [
// 					// 	'@babel/preset-env'
// 					// ]
// 				}
// 			}
// 		]
// 	}
// };
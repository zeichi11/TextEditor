module.exports = {
	mode: 'development',
	entry: './src/main/index.js',

	devServer: {
		hot: true,
		inline: true,
		host: '0.0.0.0',
		port: 9000,
		contentBase: __dirname + '/public'
	},
	devtool: "source-map"
};
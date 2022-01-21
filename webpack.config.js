const path = require('path');
const publicPath = 'http://localhost:3000/';
const config = {
	'domain': 'tccu-esig.cwdev',
};

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Extract style.css for both editor and frontend styles.
// const blocksCSSPlugin = new ExtractTextPlugin( {
// 	filename: './dist/blocks.style.build.css',
// } );

// Extract editor.css for editor styles.
// const editBlocksCSSPlugin = new ExtractTextPlugin( {
// 	filename: './dist/blocks.editor.build.css',
// } );

// Source maps are resource heavy and can cause out of memory issue for large source files.
// const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true';

// const devPlugins = [ blocksCSSPlugin, editBlocksCSSPlugin ];

// const prodPlugins = [
// 	blocksCSSPlugin,
// 	editBlocksCSSPlugin,
// ];

// Configuration for the ExtractTextPlugin — DRY rule.
const extractConfig = {
	use: [
		// "postcss" loader applies autoprefixer to our CSS.
		{ loader: 'raw-loader' },
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: [
					autoprefixer( {
						flexbox: 'no-2009',
					} ),
				],
			},
		},
		// "sass" loader converts SCSS to CSS.
		{
			loader: 'sass-loader',
			options: {
				outputStyle: 'production' === process.env.MODE ? 'compressed' : 'nested',
			},
		},
	],
};

module.exports = {
	// mode: 'development',
	mode: process.env.MODE,
	entry: {
		main: './src/index',
		// admin: './src/admin/index',
		// './dist/blocks.build': path.resolve( 'src/index.js' ), // 'name' : 'path/file.ext'.
	},
	resolve: {
		alias: {
			'node_modules': path.join(__dirname, 'node_modules'),
			'SRC': path.join(__dirname, 'src'),
			vue: 'vue/dist/vue.min.js'
		}
	},
	output: {
		pathinfo: true,
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				loader: 'babel-loader',
				test: /\.js$/,
				exclude: /node_modules/,
				query: {
					plugins: ['lodash'],
					presets: [
						['@babel/preset-env', {
							'targets': {
								'node': 6
							}
						}]
					]
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/env', '@babel/react']
					}
				}
			},
			{
				test: /\.(s)css$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: false,
								sourcemap: true,
								publicPath: '/'
							}
						},
						{
							loader: 'postcss-loader'
						},
						{
							loader: 'sass-loader'
						}
					]
				})
			},
			{
				test: /\.css$/,  
				include: /node_modules/,  
				loaders: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						publicPath: '../'
					}
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						publicPath: '../'
					}
				}]
			}
		]
	},
	plugins: [
		new BundleAnalyzerPlugin(),
		new HardSourceWebpackPlugin(),
		new ExtractTextPlugin({
			filename:  (getPath) => {
				return getPath('css/[name].css').replace('css/js', 'css');
			},
			allChunks: true
		}),
		new BrowserSyncPlugin( {
				proxy: config.domain,
				files: [
					'**/*.php'
				],
				reloadDelay: 0
			}
		),
		new UglifyJsPlugin({
			sourceMap: true,
			uglifyOptions: {
				ie8: false,
				ecma: 8,
				mangle: true,
				output: {
					comments: false,
					beautify: false
				},
				warnings: false
			}
		}),
		new ManifestPlugin({
			fileName: 'asset-manifest.json',
			writeToFileEmit: true
		})
	] 
};
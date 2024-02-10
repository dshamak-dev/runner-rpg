const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const DotenvWebpack = require('dotenv-webpack');
// const dotenv = require('dotenv');
// const webpack = require('webpack');

module.exports = (env) => {
  const rootFolder = './public';
  const buildFolder = './docs';

  return {
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
      chunkFilename: '[name].[contenthash].js',
      filename: '[name].[contenthash].js',
      assetModuleFilename: '[name].[contenthash][ext][query]',
      asyncChunks: true,
      path: path.resolve(__dirname, buildFolder),
      clean: true,
      publicPath: env.development ? '/' : './',
    },
    // watchOptions: {
    //   ignored: /node_modules/,
    // },
    devtool: 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, rootFolder),
      },
      historyApiFallback: {
        index: '/'
      },
      port: 3005,
    },
    plugins: [
      new HtmlWebpackPlugin({
        favicon: path.join(__dirname, rootFolder, 'favicon.ico'),
        template: path.join(__dirname, rootFolder, 'index.html'),
      }),
    ],
    module: {
      // exclude node_modules
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          enforce: 'pre',
          use: ['babel-loader', 'source-map-loader'],
        },
      ],
    },
    resolve: {
      alias: {
        src: '/src',
      },
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
      extensions: ['.*', '.js', '.ts', '.tsx'],
    },
    stats: {
      children: true,
      errorDetails: true,
    },
    optimization: {
      usedExports: false,
      minimize: true,
      splitChunks: {
        chunks: 'async',
      },
    },
  };
};

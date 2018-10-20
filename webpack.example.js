const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');

const srcDir = './src/example/';
const distDir = './dist-example/';
const publicPath = './';

module.exports = Object.assign(
  require('./webpack.common.js'),
  {
    entry: {
      'zee-valinator': [
        srcDir + 'script.js',
        srcDir + 'style.scss',
      ]
    },
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, distDir),
      publicPath: publicPath,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        }
      ],
    },
    plugins: [
      new CleanPlugin([ distDir ], { verbose: false }),
      new MiniCssExtractPlugin({ filename: '[name].css' }),
      new HtmlPlugin({
        hash: false,
        template: srcDir + 'index.html',
      }),
    ],
  }
);

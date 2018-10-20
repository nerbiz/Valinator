const CleanPlugin = require('clean-webpack-plugin');
const path = require('path');
const commonConfig = require('./webpack.common.js');

const srcDir = './src/';
const distDir = './dist/';

module.exports = Object.assign(
  require('./webpack.common.js'),
  {
    entry: './src/index.js',
    output: {
      filename: 'zee-valinator.js',
      path: path.resolve(__dirname, distDir),
    },
    plugins: [
      new CleanPlugin([distDir]),
    ],
  }
);

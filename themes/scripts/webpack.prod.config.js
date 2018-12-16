const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfigDev = {
  plugins: [
    // 混淆js
    // new UglifyJSPlugin(),
    // 定义环境变量为开发环境
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      IS_DEVELOPMETN: false,
    }),
  ],

};

module.exports = merge(webpackConfigBase, webpackConfigDev);

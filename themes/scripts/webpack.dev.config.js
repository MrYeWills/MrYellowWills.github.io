const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfigBase = require('./webpack.base.config');

const PORT = 2115;
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}
const webpackConfigDev = {
  plugins: [
    // 定义环境变量为开发环境
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      IS_DEVELOPMETN: true,
    }),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('../app'),
    historyApiFallback: false,
    hot: false,
    host: 'localhost',
    port: PORT,
    proxy: {
      '/cert': {
        target: 'http://192.168.193.13:7001',
        pathRewrite: {'/cert/ppppp': '/cert'},
        secure: false,
      },
      '/data': {
        target: 'http://www.weather.com.cn',
        changeOrigin: true,
        secure: false,
      },
    },
    // proxy: [
    //   {
    //     context: ['**/*getClientVersion.action', '**/*random.action'],
    //     target: 'http://192.168.193.13:7001',
    //     pathRewrite: {'/cert/ppppp': '/cert'},
    //     secure: false,
    //   }]
  },
};

// 设置代理，用于解决浏览器跨域问题，此时，
module.exports = merge(webpackConfigBase, webpackConfigDev);

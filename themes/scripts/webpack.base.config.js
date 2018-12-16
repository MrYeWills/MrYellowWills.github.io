const path = require('path');
const webpack = require('webpack');

const filename = '[hash:4].[name]';
//html-webpack-plugin 目前使用 web-webpack-plugin代替
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin(`${filename}.min.css`);

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigBase = {
  entry: {
    app: resolve('../app/app.jsx'),
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].[hash:4].js',
    chunkFilename: 'chunks/[name].[hash:4].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      ajax: path.join(__dirname, '/../app/ajax/ajax'),
      components: path.join(__dirname, '/../app/components'),
      config: path.join(__dirname, '/../app/config'),
      pages: path.join(__dirname, '/../app/pages'),
      store: path.join(__dirname, '/../app/store'),
      plugins: path.join(__dirname, '/../app/plugins'),
      style: path.join(__dirname, '/../app/style'),
      default: path.join(__dirname, '/../app/style/default.scss'),
      storage: path.join(__dirname, '/../app/storage/storage'),
      utils: path.join(__dirname, '/../app/utils'),
    },
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          //高数Babel要转换的源码使用了哪些新特性
          //stage-3是es的标准，社区提出了草案但未发布的，一般都是es6以上的标准
          //latest指es2017\es2016\es2015，目前被弃用，使用preset-env代替
          presets: ['latest', 'es2015', 'react', 'stage-3'],
          //import指babel-plugin-import插件，babel的模块化导入插件，兼容antd，antd-mobile等,
          // libraryName指明要兼容antd-mobile
          plugins: [['import', {
            libraryName: 'antd-mobile',
            style: 'css',
          }]],
        },
      },
      {
        test: /(iconfont).css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            { loader: 'css', options: { sourceMap: true } },
          ],
        }),
      },
      {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', 'autoprefixer-loader', 'sass-loader',
          ],
        }),
        // autoprefixer-loader:给css样式增加浏览器前缀
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', 'autoprefixer-loader',
          ],
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        options: {
          limit: 8192,
          name: 'img/[name].[hash:4].[ext]',
        },
      },
      {
        test: /(eraytfonts|firmfont|iconfont|eui).(woff|eot|ttf|svg|gif)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  plugins: [
    // 提取css
    extractCSS,
    // 将打包后的资源注入到html文件内
    new HtmlWebpackPlugin({
      template: resolve('../app/template.html'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app', // 入口文件名
      filename: 'common.bundle.js', // 打包后的文件名
      minChunks(module, count) {
        return module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(resolve('../node_modules')) === 0;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'async-common',
      minChunks: 3,
    }),
  ],
};

module.exports = webpackConfigBase;

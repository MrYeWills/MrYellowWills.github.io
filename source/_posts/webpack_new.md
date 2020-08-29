---
title: webpack笔记新
date: 2020/5/9
tags: webpack
categories: 
- 前端工具
series: 前端
---

## webpack常用知识
### webpack几种使用方式
#### cmd (通过指令直接编译)
```
//启用电脑全局下的webpack
webpack src/js/index.js -o build/js/built.js --mode=development 
//使用webpack开发模式，webpack 以 src/js/index.js为入口文件打包，打包后输出到  build/js/built.js

//使用项目下安装的webpack
(node) ./node_modules/.bin/webpack ./src/test.js -o build/js/built.js --mode=production
```
#### npm script
```
  "scripts": {
    //打印git日志
    "lookGitLog": "git log -2",
    //启用电脑全局下的webpack
    "startWithGlobal": "webpack --config webpack.config.js",
    //项目下安装的webpack
    "startWithLocal": "./node_modules/.bin/webpack --config webpack.config.js"
  },
```
#### 注意区别全局下webpack与项目下webpack
如上，不同的webpack使用方式会引用本地webpack或者项目下webpack，从而导致你想不到的问题，因此注意好。

#### webpack-dev-server 启动
此时不需要使用webpack，只需要webpack-dev-server即可。
```js
 "scripts": {
    "start": "node ./node_modules/.bin/webpack-dev-server --config ./打包样式/webpack.config.js",
  },
```
#### npx启动（终极方案）
上面所有关于 `./node_modules/.bin/webpack-dev-server`都可以通过npx来：
```js
 "scripts": {
    "start": "npx webpack-dev-server --config ./打包样式/webpack.config.js",
  },
```
npx是npm从5.x版本后自带的功能，用于运行包，先找项目下的包，若无，再找全局下的包，若无，就会安装。
你也可以禁止若无就安装的行为：
```
npx some-package --no-install
```

### --watch 与 webpack-dev-server区别
--watch 是webpack自带的，一旦修改了相关文件，就会自动重新编译，但与webpack-dev-server不同的是，它并不能提供服务器等功能，
无法通过服务器来访问html。

### 优化输出路径
#### outputPath 基于 output.path
```js
  output: {
    filename: 'js/built.js', //基于下面的path
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          name: '[hash:10].[ext]',//也可通过name来生产文件目录，可能基于下面的outputPath
          outputPath: 'imgs'
        }
      },
```
#### 通过name创建目录
如上。

## 黑知识
### 全局变量
- hash ext
```js
{
  // [hash:10]取图片的hash的前10位
  // [ext]取文件原来扩展名
  name: '[hash:10].[ext]'
}
```
### 想不到的依赖关系
#### less-loader 依赖 less
如果要使用，就要安装二者。
#### url-loader 依赖 file-loader
如果要使用，就要安装二者。
### node环境变量与webpack mode区别
参考下面的《node环境变量与webpack mode区别》
### 图片的使用
#### css中引用没有问题
css中直接使用url-loader即可，没有问题。
#### html中引用需另外处理
如下，url-loader默认处理不了html中img引用，需要配合html-loader一起使用。
```js
 {
        // 问题：默认处理不了html中img图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      }
```

### 如何处理剩下的所有类型文件
如果我们知道项目中只有js css html less 。
其他的文件都是一个图标字体文件，那我们可以通过file-loader来集中处理这些：
```js
   rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // 排除css/js/html资源
        exclude: /\.(css|js|html|less)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    ]
```

## 生产环境配置
### 要解决的问题
- js css 分离 （闪屏现象）
参考下面的《js css 分离 （闪屏现象）》
- 代码压缩
### js css 分离 （闪屏现象）
如果css内嵌在js内，那么页面解析时，必须要等js加载完成了，再来解析css，造成闪屏现象。
因此要通过`const MiniCssExtractPlugin = require('mini-css-extract-plugin');`分离css。
### css浏览器兼容处理
#### postcss-loader postcss-preset-env browserslist
postcss-preset-env 是 postcss-loader的一个插件，帮助postcss-loader找到在package.json中browserslist内定义的规则。
以上是处理css浏览器兼容的常规用法。
```js
{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
         
          // 使用loader的默认配置
          // 'postcss-loader',
          // 修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      }
```
```json
   //package.json
  // css兼容性处理：postcss --> postcss-loader postcss-preset-env
  // 帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
  "browserslist": {
    // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
    "development": [
      "last 1 chrome version",//兼容最新一个版本
      "last 1 firefox version",//兼容最新一个版本
      "last 1 safari version"//兼容最新一个版本
    ],
    // 生产环境：默认是看生产环境
    "production": [
      ">0.2%",//兼容99.8的版本
      "not dead",//弃用的版本不兼容
      "not op_mini all"//op_mini all是一个上古版本，早就弃用，所有不用兼容
    ]
  }
```
#### 更多配置可查看browserslist包
GitHub上有个库browserslist，可查看更多配置
#### 设置node环境变量
node环境变量通过固定名字process.env.NODE_ENV设置，如果未设置node环境变量，默认使用生产配置。
设置不同生产环境，将启动postcss使用browserslist内development、production不同配置。
#### node环境变量与webpack mode区别
node环境变量是通过process.env.NODE_ENV设置。
与webpack mode无关。
虽然webpack mode 的值与node环境变量值一样，都是 development、production。
### 压缩css
```js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
```
### eslint 检查和修复
#### 概述
eslint 首选需要 eslint-loader  eslint，
不考虑react，只考虑单纯的es6+代码检查，选用规则eslint-config-airbnb-base，
此规则依赖 eslint-config-airbnb-base  eslint-plugin-import。
如下配置好后，执行webpack编译命令 将列举有异常的页面，并自动修复。

```js
 rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,//一定要排除node_modules，否则会检查node_modules
        loader: 'eslint-loader',
        options: {
          // webpack构建时 自动修复eslint的错误
          fix: true
        }
      }
    ]
```
```json
   //package.json
    "eslintConfig": {
      "extends": "airbnb-base"//airbnb-base是检查不含react的es6+，如果是react，请使用airbnb
    }
```
#### 一定要排除node_modules
如上。
#### 自动修复配置
如上。
#### 检查react和非react代码
airbnb-base 只包含了单纯的es6+检查，如果要包含react代码检查，使用 airbnb，详细参考airbnb官网。

### js兼容处理
#### 基本依赖
处理js的基本依赖包 babel-loader @babel/core。
#### js基本语法处理
如下 @babel/preset-env 做基本语法处理，但无法处理promise高级语法
```js
  /*
        js兼容性处理：babel-loader @babel/core 
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
      */  
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            ['@babel/preset-env']
          ]
        }
      }
```
#### 全量兼容处理 @babel/polyfill （不推荐）
这种不用配置webpack，只需要在业务js中直接引用,但是有个问题，无法按需加载，除了有promise依赖，还有很多其他项目未用到的运行依赖，导致编译的包很大：
```js
import '@babel/polyfill';

const promise = new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

```

#### 按需加载兼容core-js （推荐）
在上面兼容基本语法的基础上，进行按需加载配置，此时需要安装 core-js包，并配置相关：
```js
 /*
   需要做兼容性处理的就做：按需加载  --> 需要安装包 core-js
      */  
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // usage 是 按需加载 的意思
                useBuiltIns: 'usage',
                // 指定core-js版本，一般指定3
                corejs: {
                  version: 3 
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      }
```



## FAQ
#### webpack 与 webpack-cli
这关系就好比 umi 与 create umi 的关系。
#### 配置文件为什么使用commonjs
所有的构建工具都是基于node运行，node模块化默认采用commonjs。
#### loader做的事情少 plugin做的事情多
loader一般就转义，和兼容css，压缩给plugin。


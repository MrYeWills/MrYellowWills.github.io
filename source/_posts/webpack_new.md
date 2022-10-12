---
title: webpack笔记新
date: 2020/5/9
tags: webpack
categories: 
- webpack
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

#### eslint 与js兼容处理 执行顺序
参考后面的《FAQ - eslint 与js兼容处理 执行顺序》

#### 禁用某一行eslint
```js
//eslint-disable-next-line
console.log(1)
```

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

### 缓存处理
#### 构建缓存处理
一个项目中js是最多的，构建缓存一般只处理js文件。
开启下面cacheDirectory缓存后，第二次构建时，webpack只会重新编译修改过的js，未修改的使用上次缓存，提高构建速度。
```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    ...
    // 开启babel缓存
    // 第二次构建时，会读取之前的缓存
    cacheDirectory: true
  }
},
```
#### 代码上线运行缓存优化处理
内存较多，单独在下面《代码上线运行缓存优化处理》见解。
### 代码上线运行缓存优化处理
#### 原理
后端处理：
给html引用的js，css静态文件 设置强制缓存，例如强制缓存三个月。
三个月内浏览器直接从本地读取，不用请求服务器。
前端处理：
给js、css等文件指定一个hash值的文件名。
利用html-webpack-plugin嵌入上面js、css等引用到html。
当hash码未改变时，html响应速度非常快，因为直接读取浏览器缓存。
当hash码改变时，只会从服务器从新读取最新hash值文件，未改变的静态文件依然从浏览器缓存读取。
#### webpack中的hash值处理方式
```md
 hash: 每次wepack构建时会生成一个唯一的hash值。
    问题: 因为js和css同时使用一个hash值。
      如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
  chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
    问题: js和css的hash值还是一样的
      因为css是在js中被引入的，所以同属于一个chunk
  contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样   
```
#### 推荐contenthash
参考上面所讲
#### 对chunk及chunkhash的说明
chunk的定义在entry上,下面就是两个chunk，
chunk1:`./src/js/index.js`,
chunk2:`./src/js/test.js`：
```js
 entry: ['./src/js/index.js', './src/js/test.js'],
```
对应上面两个chunk编译出来的文件，同一个chunk，其无论是css，js等的文件输出，其chunkhash都一样。
### tree shaking
tree shaking 是很形象一个比喻，比喻你摇一棵树，将树上无用的一些残枝败叶摇掉。从而将树轻装上阵。
webpack自带功能，
- 只要设置 webpack mode 为production即可
- 在项目 package.json 文件中，添加一个 "sideEffects" 入口。
- 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）
- 使用 ES2015 模块语法（即 import 和 export）
详细参考官网。
### 代码分割
#### 分割方式
无论是单入口还是多入口编译，都是通过optimization进行代码分割。
```js
 /*
    1. 可以将node_modules中代码单独打包一个chunk最终输出。(可以设置多少大小的包进行chunk抽取打包)
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk //此功能对单入口工程失效
  */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
```
#### 多入口多chunk模式
如下，打包出来的代码自然就是多文件，实现了代码分割，再结合上面说的optimization，还可以optimization自带的分割能力。
```js
 entry: ['./src/js/index.js', './src/js/test.js'],
```
#### 单入口分割（import动态导入语法的运行）
对于但入口分割，因为只有一个chunk，因此optimization的第二个功能（将公共的文件单独打包一个chunk）对单入口项目无效。
但我们又想实现这个功能，
只能对js进行处理了，这里使用import动态导入语法。
```js
//index.js
/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包
*/
import(/* webpackChunkName: 'test' */'./test')
  .then(({ mul, count }) => {
    // 文件加载成功~
    // eslint-disable-next-line
    console.log(mul(2, 5));
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败~');
  });
```
#### 代码分割与dllplugin区别
代码分割，比如node module 内打包成一个chunk，好像与dllplugin类似。
二者结果是一样的，但解决的问题不一样。
代码分割，目的在于加速页面渲染。 
主要用于生产环境，将一个大js分割成小js，加速页面渲染。
dllplugin ，目的在于极快提高webpack构建速度，同时也可进一步分割node module代码，可运用于页面优化。 
可用于开发和生产环境，第一次打包好的代码，下次打包不用重新编译。
#### 代码分割与懒加载的联系(import动态导入语法)
import动态导入语法会导致代码进行代码分割。
然后等待渲染某一页面时，再调用import动态导入语法，就是一种懒加载设计模式。

#### optimization用于生产环境
optimization一般用于生产环境，用在开发环境的话，意义不大。

### 懒加载 预加载
#### 概述
```js
document.getElementById('btn').onclick = function() {
  // 懒加载~：当文件需要使用时才加载~
  // 预加载 prefetch：会在使用之前，提前加载js文件 
  // 正常加载可以认为是并行加载（同一时间加载多个文件）  
  // 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
};

```
#### webpackPrefetch 做预加载
pc端用得多，谷歌兼容较好，但ie比较差，移动端可能兼容会有些问题。
上面的预加载，是项目一启动，等http请求完毕后，又空闲了，再来加载动态导入的文件。
不过此时项目并不会引入该文件执行，只有点击上面的按钮时，才执行文件里面的代码。

### 其他处理
#### js、html压缩
webpack 自带js压缩，只要将webpack 的mode 改成 production 模式，就自动压缩js。
html的压缩可通过html插件来做：`const HtmlWebpackPlugin = require('html-webpack-plugin');`

### FAQ
#### eslint 与js兼容处理 执行顺序
应该先执行eslint，后执行js babel-loader。
一旦eslint报错，就没必要再执行 babel-loader来了，
反过来，一旦babel-loader编译后，其编译代码肯定报一大堆eslint错误。

另外一个问题，配置，保证eslint先执行呢？
首先插件顺序上，eslint在前，而且给配置一个参数即可：
```js
{
  test: /\.js$/,
  enforce: 'pre',// 优先执行
  loader: 'eslint-loader',
},
```
### demo
[基础生产配置 demo](https://github.com/YeWills/webpack-code/tree/web4.4/webpack%E6%95%99%E7%A8%8B%E4%BB%A3%E7%A0%81/3.webpack%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE/16.%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE)
## 构建优化
### HMR
HMR: 称之为 热模块替换 / 模块热替换
作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所有模块），极大提升构建速度，同时提升页面渲染速度，因为不用重新渲染整个页面。
#### 开启HMR：
```js
  devServer: {
    // 开启HMR功能
    hot: true
  }
```
#### 不同种类文件HMR
- 样式文件：可以使用HMR功能，不用再进行配置：因为style-loader内部实现了，因此开发模式下，css请使用style-loader处理。
- js文件：默认不能使用HMR功能 --> 需要修改js代码，添加支持HMR功能的代码
    注意：HMR功能对js的处理，只能处理非入口js文件的其他文件。
- html文件: 默认不能使用HMR功能.如果实在想做HMR，解决方法：修改entry入口，将html文件引入。不过spa应用不用做html的HMR。
```js
 entry: ['./src/js/index.js', './src/index.html'],
```
#### js的HMR
```js
// 引入
import print from './print';

console.log('index.js文件被加载了~');
print(); // 这里写一遍
function add(x, y) {
  return x + y;
}
console.log(add(1, 3));

if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', function() {
    // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    // 会执行后面的回调函数
    print(); // 这里重复写一遍
  });
}
```
js的HMR主要利用 module.hot.accept方法的第二参数callback，此方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
要注意的是**HMR功能对js的处理，只能处理非入口js文件的其他文件。**在非入口文件也可以，但失去意义。
#### demo
[demo](https://github.com/YeWills/webpack-code/tree/web4.4/webpack%E6%95%99%E7%A8%8B%E4%BB%A3%E7%A0%81/4.webpack%E4%BC%98%E5%8C%96%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE/18.HMR)
### source map
source map主要在 构建速度 调试信息显示 是否隐藏源码 三方面做平衡。
在选择哪一种时，基本上基于以上三方面进行平衡。
是否隐藏源码主要用于生产环境下，不过也不一定，有些生产环境下也不要求隐藏源码。
就react而言，
开发模式下 选择eval-source-map
生产模式根据是否隐藏源码 选择 nosources-source-map hidden-source-map source-map 或不source map。
```md
source-map: 一种 提供源代码到构建后代码映射 技术 （如果构建后代码出错了，通过映射可以追踪源代码错误）

    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

    source-map：外部
      错误代码准确信息 和 源代码的错误位置
    inline-source-map：内联
      只生成一个内联source-map
      错误代码准确信息 和 源代码的错误位置
    hidden-source-map：外部
      错误代码错误原因，但是没有错误位置
      不能追踪源代码错误，只能提示到构建后代码的错误位置
    eval-source-map：内联
      每一个文件都生成对应的source-map，都在eval
      错误代码准确信息 和 源代码的错误位置
    nosources-source-map：外部
      错误代码准确信息, 但是没有任何源代码信息
    cheap-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      只能精确的行
    cheap-module-source-map：外部
      错误代码准确信息 和 源代码的错误位置 
      module会将loader的source map加入

    内联 和 外部的区别：1. 外部生成了文件，内联没有 2. 内联构建速度更快

    开发环境：速度快，调试更友好
      速度快(eval>inline>cheap>...)
        eval-cheap-souce-map
        eval-source-map
      调试更友好  
        souce-map
        cheap-module-souce-map
        cheap-souce-map

      --> eval-source-map  / eval-cheap-module-souce-map

    生产环境：源代码要不要隐藏? 调试要不要更友好
      内联会让代码体积变大，所以在生产环境不用内联
      nosources-source-map 全部隐藏
      hidden-source-map 只隐藏源代码，会提示构建后代码错误信息

      --> source-map / cheap-module-souce-map
```
### oneof(只让一个loader处理)
常规的loader写法会将所有文件给每个loader都过一遍，只是有些能被loader处理，有些不能，但都会被过一遍，这样不利于构建速度，oneof解决了这个问题，一旦文件被命中，就不会过下面的loader，提高了构建速度。

如果一个类型文件 被多个loader 同时处理，留一个loader在oneof里面就行。

### 多线程
thread-loader ，如果项目比较小，可不用启动多线程，因此多线程的启动也需要1秒时间。
```js
{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              /* 
                开启多进程打包。 
                进程启动大概为600ms，进程通信也有开销。
                只有工作消耗时间比较长，才需要多进程打包
              */
              {
                loader: 'thread-loader',
                options: {
                  workers: 2 // 进程2个
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                    ]
                  ],
                }
              }
            ]
          },
```

### cdn 与 external
一旦使用了cdn，就需要使用external，以此告诉webpack，不要打包通过cdn依赖的包。

### dll
#### 概述
用到的包：
- webpack.DllPlugin
- webpack.DllReferencePlugin
- require('add-asset-html-webpack-plugin')
原理：
webpack.dll.js：
- 定义编译后的包的输出路径和名字
- 通过webpack.DllPlugin生成manifest.json映射文件，并定义生成路径
webpack.config.js
- DllReferencePlugin 利用manifest.json 告诉webpack不要编译哪些依赖包
- AddAssetHtmlWebpackPlugin 将webpack.dll.js中生成的编译包引入到html中，并定义好script标签。

#### webpack.dll.js
```js
/*
  使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
    当你运行 webpack 时，默认查找 webpack.config.js 配置文件
    需求：需要运行 webpack.dll.js 文件
      --> webpack --config webpack.dll.js
*/
const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 最终打包生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]' // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和jquery映射
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库的暴露的内容名称
      path: resolve(__dirname, 'dll/manifest.json') // 输出文件路径
    })
  ],
  mode: 'production'
};
```
#### webpack.config.js
```js
//webpack.config.js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'built.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变~
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // 将某个文件打包输出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
  mode: 'production'
};
```
### 小结
开发环境性能优化：
 - 优化打包构建速度
  - HMR
 - 优化代码调试
  - source-map

生产环境性能优化：
 - 优化打包构建速度
  - oneof
  - babel缓存
  - 多进程打包
  - externals
  - dll
 - 优化代码运行性能
  - 缓存（hash码）
  - tree shaking
  - code split
  - 懒加载／预加载
  - pwa

## 配置
### output
#### publicPath
定义服务器中路径，可以通过插件，编译后在html中看到变化：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body>
  <!-- publicPath：'/test/' -->
  <script src="/test/built.js"></script></body>
</html>
```
#### chunkFilename
定义非chunk入口文件名，如import动态写法的，optimization 生成的。

### module
#### enfore
可以让loader提前或延迟执行。
#### oneOf
参看本文其他地方提到都 oneOf
### optimization
#### runtimeChunk
如果有import动态引入写法，runtimeChunk必须配置。
```js
 optimization: {
    splitChunks: {
      chunks: 'all'
    },
    // 将当前模块的记录其他模块的hash单独打包为一个文件 runtime
    // 解决：修改a文件导致b文件的contenthash变化
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    },
  }
```


## FAQ
#### webpack 与 webpack-cli
这关系就好比 umi 与 create umi 的关系。
#### 配置文件为什么使用commonjs
所有的构建工具都是基于node运行，node模块化默认采用commonjs。
#### loader做的事情少 plugin做的事情多
loader一般就转义，和兼容css，压缩给plugin。
#### import动态导入语法
import动态导入语法写法必然会导致webpack进行代码分割。

通过如下的注释写法，让webpack代码分割时，设置输出文件名称，
通过webpackPrefetch设置预加载。
```js
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
```
#### dll与代码分割的联系与分工
代码分割说的是optimization与import动态写法
项目代码分为两种：
- node module
可通过optimization进行分割，缺点是所有的node module包只能打包成一个；
也可通过dll进行分割，优点在于可将node module包进行一个个分割打包成多个；
- 业务js
可通过import动态写法打包。
#### 4.26版本后使用terser-webpack-plugin作压缩
新的webpack版本使用terser-webpack-plugin来作压缩。




---
title: webpack源码系列(七)：你不知道的webpack[完结]
date: 2022/4/12
tags: [webpack, webpack源码系列]
categories: 
- webpack源码系列
---



## 黑知识

### 为什么说webpack只能处理js
webpack的Parser内核是acorn，是用于解析js的。
所以webpack只能编译处理js。
node能够处理的有两种，一个是字符串，一个是buffer流，
比如文件就是一个buffer流，
在webpack中，处理图片文件时，会通过loader，将此图片编译为一个base64 url(也是一个字符串) 或将这个图片拷贝至dist目录，
然后生成一个该图片的引用路径(也是一个字符串),
也就是说，文件流经过loader处理后，都变成了一个字符串，这个时候再传给webpack，webpack就可以识别了。

>下面摘录至官网
loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。
loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

```js
// node_modules\webpack\lib\Parser.js
const acorn = require("acorn");
```

### 为什么说webpack要借助loader来处理非js
参考《为什么说webpack只能处理js》


### 插件比loader能做的事情更加广泛
loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。
插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
[参考官网](https://www.webpackjs.com/concepts/#%E6%8F%92%E4%BB%B6-plugins-)

插件目的在于解决 loader 无法实现的其他事。[参考官网](https://www.webpackjs.com/concepts/plugins/)



### 监听(Watching)
[参考](https://webpack.docschina.org/api/node/#watching)
```js
const webpack = require('webpack');

const compiler = webpack({
  // [配置对象](/configuration/)
});

const watching = compiler.watch({
  // [watchOptions](/configuration/watch/#watchoptions) 示例
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => { // [Stats Object](#stats-object)
  // 这里打印 watch/build 结果...
  console.log(stats);
});
```


### 由多入口文件共享引起的问题
[参考](https://webpack.docschina.org/api/node/#watching)

主要是对象的[浅拷贝问题](https://bundlers.tooling.report/code-splitting/multi-entry/)，解决方法如下：
[详细参考官网](https://webpack.docschina.org/guides/code-splitting/#entry-dependencies)
```js
  optimization: {
    runtimeChunk: 'single',
  }
```

###  import() and CommonJs 问题
我们之所以需要 default，是因为 webpack 4 在导入 CommonJS 模块时，将不再解析为 module.exports 的值，
而是为 CommonJS 模块创建一个 artificial namespace 对象，更多有关背后原因的信息，[请阅读 webpack 4: import() and CommonJs](https://medium.com/webpack/webpack-4-import-and-commonjs-d619d626b655)。
[详细参考官网](https://webpack.docschina.org/guides/code-splitting/#dynamic-imports)
```js
  return import('lodash')
    .then(({ default: _ }) => {
      const element = document.createElement('div');
       element.innerHTML = _.join(['Hello', 'webpack'], ' ');
```




### 如何代码分离重型依赖库

#### 不推荐，可拓展下视野
虽然下面是多entry，重复依赖提取，但也给了一种思路，如何将重型第三方包提取到一个单独的 chunk中的思路。
[参考官网](https://webpack.docschina.org/guides/code-splitting/#prevent-duplication)
```js
 module.exports = {
   mode: 'development',
   entry: {
    index: {
      import: './src/index.js',
      dependOn: 'shared',
    },
    another: {
      import: './src/another-module.js',
      dependOn: 'shared',
    },
    shared: 'lodash',
    // 也可以使用数组
    // shared: ['lodash','react'],
   },
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
   },
 };
```

#### 推荐SplitChunksPlugin

[当然最好的方法，推荐用官网的](https://webpack.docschina.org/guides/caching/#extracting-boilerplate)
```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new HtmlWebpackPlugin({
      title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      runtimeChunk: 'single',
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
    },
  };
```


### resolveLoader 与 resolve
webpack的世界有上面两套 resolve 规则.

resolver 是一个库(library)，用于帮助找到模块的绝对路径。[参考官网](https://www.webpackjs.com/concepts/module-resolution/)
说明webpack最后将所有的相对路径解析为 绝对路径。
它支持的绝对路径有这几种：
```js
import "/home/me/file";
import "C:\\Users\\me\\file";
```
resolveLoader 与 resolve 的配置意义规则相同，
秉着 单一职责原则，设计两个分别控制 module的import(用于业务代码内的import)以及 loader的import。

从这个角度看出。
webpack的世界有上面两套 resolve 规则定义，
一般只需要定义 resolve 即可，除非我们要自定义loader 时，可能要用到 resolveLoader。




### 模块热替换如何运行的
在应用程序中
通过以下步骤，可以做到在应用程序中置换(swap in and out)模块：
- 应用程序要求 HMR runtime 检查更新。
- HMR runtime 异步地下载更新，然后通知应用程序。
- 应用程序要求 HMR runtime 应用更新。
- HMR runtime 同步地应用更新。
等等。。
[详细参考官网](https://webpack.docschina.org/concepts/hot-module-replacement/#how-it-works)


### webpack 是什么
它是一个工具，可以打包你的 JavaScript 应用程序（支持 ESM 和 CommonJS），可以扩展为支持许多不同的静态资源，例如：images, fonts 和 stylesheets。
[详细参考官网](https://webpack.docschina.org/concepts/why-webpack/#wouldnt-it-be-nice)

以上说明了webpack的两个特色和两个主要工作内容：
- 编译js(支持 ESM 和 CommonJS)
- 同时有能力编译 文件流


### chunk 有两种形式
[官网关于这个讲的非常好](https://webpack.docschina.org/concepts/under-the-hood/#chunks)
>initial(初始化) 是入口起点的 main chunk。此 chunk 包含为入口起点指定的所有模块及其依赖项。
non-initial 是可以延迟加载的块。可能会出现在使用 动态导入(dynamic imports) 或者 SplitChunksPlugin 时。


这篇官网内容也介绍了
```
output.filename - 用于 initial chunk 文件
output.chunkFilename - 用于 non-initial chunk 文件
```


### magic comment(魔术注释)
[同样参考官网](https://webpack.docschina.org/concepts/under-the-hood/#chunks)
```js
import(
  // 下面就是魔术注释，会被webpack解析，魔术注释在webpack中还有其他应用
  /* webpackChunkName: "app" */
  './app.jsx'
).then((App) => {
  ReactDOM.render(<App />, root);
});
```

### 好用的cli
注意版本号要在 webpack 5.x
```s
npx webpack info --output markdown  #打印webpack loader信息，以及电脑、浏览器信息，非常棒
npx webpack configtest ./webpack.config.js
npx webpack init ./my-app #这个用于webpack 测试非常方便，然后根据提示是否使用es、scss，不要使用--template=default
npx webpack --progress #显示构建进度
npx webpack --json stats.json #生成stats对象，可用于 webpack-bundle-analyzer 分析
npx webpack --config ./first.js --config ./second.js --merge #合并配置，底层基于webpack-merge
npx webpack --analyze #先确保 webpack-bundle-analyzer 安装
```

#### cli配置优先级高于webpack.config.js
注意的是 cli 的配置，优先级要比 webpack.config.js 的高。
比如：
```s
 npx webpack --output-path customdist
```
上述优先级高于webpack.config.js:
```js
const config = {
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
}
```
[参考 通用配置](https://webpack.docschina.org/api/cli/#common-options)

### export与import的对象无法使用 现象汇集

#### 懒加载的时候
```js
// 在懒加载的使用：
 button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
     const print = module.default;

     print();
   });

```

[参考](https://webpack.docschina.org/guides/lazy-loading/#example)
>注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。

#### ts

>如果想在 TypeScript 中保留如import _ from 'lodash';的语法被让它作为一种默认的导入方式，需要在文件 tsconfig.json 中设置 "allowSyntheticDefaultImports" : true 和 "esModuleInterop" : true 。这个是与 TypeScript 相关的配置，在本文档中提及仅供参考。

```js
// 在ts中
 import _ from 'lodash'; //错误
 import * as _ from 'lodash'; //正确
```
[参考](https://webpack.docschina.org/guides/typescript/#basic-setup)


#### webpack.config.ts

[参考](https://webpack.docschina.org/configuration/configuration-languages/#typescript)

```js
import * as path from 'path';
import * as webpack from 'webpack';
```

### Shimming 如何兼容(老)library打包

Shimming 有点类似打补丁的意思。

Shimming 有两部分意思：
第一 polyfill 的注入；
第二 非规范的使用一些库library，这里又有两层意思：
- 处理 比如 将lodash 放到 全局环境中；
- 将以前的一些老版本库或没有提供commonjs 或 esm 标准的，如何嵌入到当前主流的模块化项目中使用。

Shimming 的思想不符合 webpack的推荐的闭环模块化思想，但webpack推荐的闭环模块化思想不一定能满足一个项目所有的编译需求，
因此也是webpack 对其编译思想的一个延申。

[详细参考 官网](https://webpack.docschina.org/guides/shimming/)

>webpack 背后的整个理念是使前端开发更加模块化。也就是说，需要编写具有良好的封闭性(well contained)、不依赖于隐含依赖（例如，全局变量）的彼此隔离的模块

### webpack的target配置

直接定义的方式，参考官网，
[官网还写了配合使用](https://webpack.js.org/configuration/target/#browserslist)
其实是这样理解的，任何 browserslist 的定义方式，都会被webpack target 读取。
因此webpack target 定义 browserslist 时，并非给target赋值，
而是按照 browserslist 规范，定义成 .browserslistrc 或 package.json内，等等。

### webpack-dev-server 与 IE 兼容问题

参考《babel笔记 -- webpack-dev-server 与 IE 兼容问题》

### webpack-dev-server 调试

> [参考 官网](https://webpack.docschina.org/configuration/dev-server/#devserver)
如果你碰到了问题，请将路由导航至 /webpack-dev-server 将会为你展示服务文件的位置。例如： http://localhost:9000/webpack-dev-server。


### 正则与 glob 模式区别：
webpack中的正则与 glob 模式区别：

关于glob-to-regexp：
[参考-glob-to-regexp](https://github.com/fitzgen/glob-to-regexp)
[参考 - webpack官网](https://webpack.docschina.org/configuration/watch/#watchoptionsignored)
>当使用 glob 模式时，我们使用 glob-to-regexp 将其转为正则表达式，因此，在使用 watchOptions.ignored 的 glob 模式之前，请确保自己熟悉它。

```js
module.exports = {
  //...
  watchOptions: {
    ignored: '**/node_modules',
  },
};
```

关于正则：
[参考 - webpack官网](https://webpack.docschina.org/configuration/watch/#watchoptionsignored)
>当使用 glob 模式时，我们使用 glob-to-regexp 将其转为正则表达式，因此，在使用 watchOptions.ignored 的 glob 模式之前，请确保自己熟悉它。

```js
module.exports = {
  //...
  watchOptions: {
    ignored: /node_modules/,
  },
};
```

### ProvidePlugin DefinePlugin

前者用于 全局引入 第三方包，省去每次 import 的麻烦；
后者用于 定义变量值，相当于一个传送门，将编译态的数据传送给业务代码使用；


## 黑知识二

### 为什么所有的loader可将文件写入内存
dev模式下，webpack-dev-server可以轻易将webpack的产物打包到内存中，
但比如file-loader 为什么也可以轻易将产物打包进入内存，
其原因可能有：
webpack源码中，有一套 fs 系统，在compiler初始化的时候，初始好的，
默认情况下，webpack使用 node 的fs库，初始化webpack的fs系统，
但是在webpack-dev-server中，使用了能写入内存的fs来初始化了webpack的fs系统，
所以后面所有的loader也好、plugin也好，使用的fs，其实就拥有了这个写入内存的能力。



## webpack源码学习经验


阶段一：了解webpack的事件机制 tapable，如果有一定了解了，就不用看了：
[找webpack-tapable 系列的视频快速刷一遍，对 tapable有个印象即可](https://space.bilibili.com/32277451?spm_id_from=333.788.b_765f7570696e666f.2)


阶段二：先大量刷视频，目的 了解webpack调试入门，以及loader与plugin的大致使用：

手摸手带你实现打包器 仅需 80 行代码理解 webpack 的核心  https://www.bilibili.com/video/BV1oL411V7BQ?spm_id_from=333.999.0.0
实现 loader视频： https://www.bilibili.com/video/BV1d5411d7kH?spm_id_from=333.999.0.0
实现 plugins视频： https://www.bilibili.com/video/BV1d5411d7kH?spm_id_from=333.999.0.0

webpack5 源码分析 视频： https://www.bilibili.com/video/BV12L411t7Pr?spm_id_from=333.999.0.0

任务14：webpack调试和阅读 https://www.bilibili.com/video/BV1N5411j74S?p=14
任务15：webpack自定义loader https://www.bilibili.com/video/BV1N5411j74S?p=14


阶段三：大量刷webpack源码相关的系列文档
[[万字总结] 一文吃透 Webpack 核心原理](https://xie.infoq.cn/article/ddca4caa394241447fa0aa3c0)
这个系列最经典，后期自己独自看源码时跟着这个教程走 --- [webpack4 源码分析系列  -里面去找webpack源码系列](https://blog.flqin.com/archives/)
[webpack3 源码分析系列： 玩转webpack（一）上篇：webpack的基本架构和构建流程](https://cloud.tencent.com/developer/article/1006353)
[webpack3 源码分析系列： 玩转webpack（一）下篇：webpack的基本架构和构建流程](https://cloud.tencent.com/developer/article/1006354)
[webpack3 源码分析系列： 玩转webpack（二）：webpack的核心对象](https://cloud.tencent.com/developer/article/1030740?from=article.detail.1006354)
[webpack3 源码分析系列： 玩转webpack 备用地址](https://lxzjj.github.io/2017/11/02/%E7%8E%A9%E8%BD%ACwebpack%EF%BC%88%E4%B8%80%EF%BC%89/)

阶段四：自己调试webpack源码
跟着这个教程走 --- [webpack4 源码分析系列  -里面去找webpack源码系列](https://blog.flqin.com/archives/)，
debug webpack源码。

阶段五：刷一遍webpack官网：
这里要注意刷中文官网顺序：
概念
api
指南
配置
loader
plugin
概念、api、指南、配置 要细看；
loader、plugin 扫了一眼，主要讲各个loader plugin的使用方法，看的价值不高，用的时候再看比较好，这两个只花了两个小时看完。



## 待研究
### entry 多个属性对象与数组定义方法使用场景
一种是entry 数组的定义方式：
[参考官网这里的 注解部分 【当你向 entry 传入一个数组时会发生什么？】 - 单个入口（简写）语法](https://www.webpackjs.com/concepts/entry-points/#%E5%8D%95%E4%B8%AA%E5%85%A5%E5%8F%A3-%E7%AE%80%E5%86%99-%E8%AF%AD%E6%B3%95)

一种是多属性的定义方式：
```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```
[参考官网 - 分离 应用程序(app) 和 第三方库(vendor) 入口](https://www.webpackjs.com/concepts/entry-points/#%E5%88%86%E7%A6%BB-%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F-app-%E5%92%8C-%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93-vendor-%E5%85%A5%E5%8F%A3)
下面摘录上面官网链接的章节， 这部分描述同样值得关注
>为什么？此设置允许你使用 CommonsChunkPlugin 从「应用程序 bundle」中提取 vendor 引用(vendor reference) 到 vendor bundle，并把引用 vendor 的部分替换为 `__webpack_require__()` 调用。如果应用程序 bundle 中没有 vendor 代码，那么你可以在 webpack 中实现被称为长效缓存的通用模式。

我觉得在对于一些 cdn 等等， 可能会以 entry 数组的方式 引入。
目前好奇的是，这些适合什么样的场景。
学会适用场景为自己项目所用。

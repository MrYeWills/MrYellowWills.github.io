---
title: 你不知道的webpack(三)
date: 2022/4/12
tags: webpack
categories: 
- 前端工具
series: 前端
---



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
下面摘录上面官网链接的章节， 这部门描述同样值得关注
>为什么？此设置允许你使用 CommonsChunkPlugin 从「应用程序 bundle」中提取 vendor 引用(vendor reference) 到 vendor bundle，并把引用 vendor 的部分替换为 __webpack_require__() 调用。如果应用程序 bundle 中没有 vendor 代码，那么你可以在 webpack 中实现被称为长效缓存的通用模式。

我觉得在对于一些 cdn 等等， 可能会以 entry 数组的方式 引入。
目前好奇的是，这些适合什么样的场景。
学会适用场景为自己项目所用。

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
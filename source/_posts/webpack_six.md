---
title: webpack源码系列(获)：核心概念
date: 2022/4/12
tags: [webpack, webpack源码系列]
categories: 
- webpack源码系列
---


## 核心概念

### bootstrap runtime
每个 bundle 中都有一个 webpack 引导(bootstrap) [参考](https://www.webpackjs.com/concepts/entry-points/#%E5%88%86%E7%A6%BB-%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F-app-%E5%92%8C-%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93-vendor-%E5%85%A5%E5%8F%A3)。
bootstrap 就是 runtime；
二者都是一个意思。即：

[参考](https://blog.flqin.com/383.html)
```js
 function __webpack_require__(moduleId){
    //...
  }
```

bootstrap 更准确的是引导的意思，[参考官网bootstrap](https://webpack.docschina.org/guides/build-performance/#bootstrap)


### library 库
[library 在webpack源码中，可以指 为依赖库或第三方包的意思](https://webpack.docschina.org/guides/caching/#extracting-boilerplate)；
[或参考官网这篇文章内涉及到的 library](https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules)

[实际上 library 其实就是一个 第三方库，和npm包](https://webpack.docschina.org/guides/author-libraries/)。

---
title: 关于依赖和编译
date: 2023/05/29
tags: [rollup, webpack, npm, yalc]
categories: 
- 前端工程
---


## 探究两个问题：
- rollup能打包没有安装过的依赖。
- react组件包，如何不打包react 依赖外部react？

### 前情准备 peerDependencies external
[一文搞懂 peerDependencies + external](https://juejin.cn/post/7005890056640528421)


## rollup能打包没有安装过的依赖
rollup 编译时，当import某个包时，
如果此包存在于node_modules中，则会被打包进去；
如果此包不存在于node_modules中，则会以：
```js
require('某包')
```
这样的话，只要其他包或项目中，引入了某包，则能正常使用。
这样就产生了一个现象：
如果 teatA 依赖 testB，
当testB存在于node_modules中时，每次testB增加版本，
则testA，也必须重新安装依赖，并重新打包。
当testB不存在于node_modules中时，每次testB增加版本，
则testA，不需要重新安装依赖，打包。
以上现象 无论是 umd cjs ，现象是一样的。
测试例子在：
[hz-test3-a](https://github.com/YeWills/rollup/tree/%E4%B8%89%E5%B1%82%E4%BE%9D%E8%B5%96%E7%9A%84%E6%89%93%E5%8C%85%E6%83%85%E5%86%B5/hz-test3-a)
[hz-test3-b](https://github.com/YeWills/rollup/tree/%E4%B8%89%E5%B1%82%E4%BE%9D%E8%B5%96%E7%9A%84%E6%89%93%E5%8C%85%E6%83%85%E5%86%B5/hz-test3-b)
引用：
[hz-node](https://github.com/YeWills/rollup/tree/%E4%B8%89%E5%B1%82%E4%BE%9D%E8%B5%96%E7%9A%84%E6%89%93%E5%8C%85%E6%83%85%E5%86%B5/hz-node)


### 测试demo
本次测试demo地址在
[三层依赖的打包情况 git分支](https://github.com/YeWills/rollup/tree/%E4%B8%89%E5%B1%82%E4%BE%9D%E8%B5%96%E7%9A%84%E6%89%93%E5%8C%85%E6%83%85%E5%86%B5)


## react组件包，如何不打包react 依赖外部react？

写了一个 react 组件包，[react-h5-mobile-hz](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85/react-h5-mobile-hz)

写了一个react工程项目[react-project](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85/react-project)，使用了该包

### 实现react组件包，如何不打包react 依赖外部react:
改造
react-h5-mobile-hz，

<!-- webpack.build.config.js -->
```js
   externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'hz-test3-b': {
            root: 'hz-test3-b',
            commonjs2: 'hz-test3-b',
            commonjs: 'hz-test3-b',
            amd: 'hz-test3-b'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        }
    }
```

因为使用外部依赖，那么声明一下外部依赖的版本，package.json :
```js
  "peerDependencies": {
    "react": ">=16",
    "hz-test3-b": ">=2",
    "react-dom": ">=16"
  },
```

调试：
使用 yalc 调试
```js
 "async": "npm run clean && npm run build && yalc push",
```

修改引用的工程，切换到开发模式下
这样更好查看源码

```js
// react-project

 // 这里为了测试打包代码方便，使用开发模式，让打包出来的源码更好分析，
    // 实际上，需要使用 production 
    // mode: "production",
    mode: "development",
```


打包：
npm run build
查看代码，我们对 react 还有 hz-test3-b 进行了依赖外部打包处理，这里就分别形成了两个 变量 `__WEBPACK_EXTERNAL_MODULE_react__` `__WEBPACK_EXTERNAL_MODULE_hz_test3_b__` ，
我们这里会看到一个现象， 尽管我们声明了依赖 react react-dom，但源码打包出来后，只有一个 react 变量为上面的 `__WEBPACK_EXTERNAL_MODULE_react__` 
```js
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("hz-test3-b"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "hz-test3-b"], factory);
	else if(typeof exports === 'object')
		exports["ReactMobileCalendar"] = factory(require("react"), require("hz-test3-b"));
	else
		root["ReactMobileCalendar"] = factory(root["React"], root["hz-test3-b"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE_react__, __WEBPACK_EXTERNAL_MODULE_hz_test3_b__) {

// 源码....

}
```

在使用的工程中打包
执行 
```js
// react-project
npm run build
```

```js
// main.913e0ce1.js

// EXTERNAL MODULE: ./node_modules/react-h5-mobile-hz/lib/react-mobile-calendar.min.js
var react_mobile_calendar_min = __webpack_require__(806);

```



```js
// vendors.05e9fbbd.js

/***/ 806:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(294), __webpack_require__(493));
	else {}
})(self, function(__WEBPACK_EXTERNAL_MODULE_react__, __WEBPACK_EXTERNAL_MODULE_hz_test3_b__) {





/***/ 493:
/***/ (function(module) {


module.exports = {
    ccddqq: '1.0.7版本'
}


/***/ }),



/***/ }),

/***/ 294:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


```
上面的 806 就是 react-h5-mobile-hz 组件
493 是 __WEBPACK_EXTERNAL_MODULE_hz_test3_b__
294 是 React


### 测试demo
本次测试demo地址在
[git分支 最纯粹的react工程引用最纯粹的react组件包 ](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85)


## demo
### 最简单的react 项目工程demo
最简单的react demo ，本例是最简单的react工程：[react-project](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85/react-project)


### 最简单的react组件包
最简单的react 组件；
[react-h5-mobile-hz](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85/react-h5-mobile-hz)

### yalc 调试demo；
最简单的 npm 包调试；
[git分支 最纯粹的react工程引用最纯粹的react组件包 ](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85)

### 简单的 rollup demo
本例用于三层依赖 打包分析。
[三层依赖的打包情况 git分支](https://github.com/YeWills/rollup/tree/%E4%B8%89%E5%B1%82%E4%BE%9D%E8%B5%96%E7%9A%84%E6%89%93%E5%8C%85%E6%83%85%E5%86%B5)



### 最简单的react工程调试react组件包
本react不包含任何 样式、ts、router 等等代码，
单纯的 webpack + react 进行打包，分析最纯粹的 打包产物。

react 组件包 也是非常纯粹的 react + js 。
用于分析最纯粹的问题

[git分支 最纯粹的react工程引用最纯粹的react组件包 ](https://github.com/YeWills/react-demo/tree/%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E5%B7%A5%E7%A8%8B%E5%BC%95%E7%94%A8%E6%9C%80%E7%BA%AF%E7%B2%B9%E7%9A%84react%E7%BB%84%E4%BB%B6%E5%8C%85)

### 经典的react组件打包范例
[这个工具是一个经典的 react 组件打包范例](https://github.com/nfl/react-helmet/tree/master)，
包含了如何对 dependencies 、 peerDependencies 不进行打包：
```js
    external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies)
    ]
```



## 参考
[一文搞懂 peerDependencies](https://juejin.cn/post/7005890056640528421)
[react-mobile-calendar 移动端日历组件](https://github.com/Shenenkaka/react-mobile-calendar.git)
[r从 0 到 1 搭建基于 Webpack5 + React18 + TypeScript4 的自用脚手架。](https://github.com/chendadou/react-demo.git)
















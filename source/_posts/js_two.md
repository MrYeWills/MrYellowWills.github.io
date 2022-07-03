---
title: js笔记(二)
date: 2021/6/27
tags: [自运行函数写法形式]
categories: 
- js
series: js
---

## js 常用知识


### js模块化之CommonJS、AMD、UMD、ES6

#### CommonJS
[参考](https://copyfuture.com/blogs-details/20210206004524332u)

#### 调试 CommonJS
其实也是上面 参考中的内容
```js
//module-a.js

console.log('模块中的第一句代码');

console.log(arguments.callee.toString())


// 运行 node module-a.js
//运行结果

模块中的第一句代码

function (exports, require, module, __filename, __dirname) {

console.log('模块中的第一句代码');

console.log(arguments.callee.toString())

}
```

#### exports module.exports require 的由来

参考 《CommonJS》， 说白了，就是node的v8引擎 自己实现了一套  exports module.exports require 的runtime；
类似于webpack的runtime。

#### AMD、CMD、UMD、ES6
关于这部分的讲解，[参考](https://www.bbsmax.com/A/n2d9y6k4dD/)
其中 AMD、CMD 属于上古时期的规范，可以不用care，
可以稍微了解下，兼容 CommonJS、amd ，同时可通过命名空间直接运行于浏览器的 兼容规范 UMD ,
下面是rollup打包出来的 umd 规范代码：
```js
(function (global, factory) {
    // 用于兼容 commonjs
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    // 用于兼容 amd
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      // 用于兼容 命名空间 直接运行于浏览器
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.hztestrp = {}));
})(this, (function (exports) { 'use strict';

    function index(){
        console.log('99112233');
        console.log('99112233');
        console.log('99112233');
    }

    const cc = ()=>{
        alert('tiandadida 9999888');
    };

    exports.cc = cc;
    exports["default"] = index;

    Object.defineProperty(exports, '__esModule', { value: true });

}));

```

#### demo 与参考
todo
[本示例 - js-standard-demo]()通过 rollup 打包 esm cjs umd amd 三种规范的代码， 对 这几个规范有一个直观了解。

[参考](https://www.bbsmax.com/A/n2d9y6k4dD/)
[参考](https://copyfuture.com/blogs-details/20210206004524332u)
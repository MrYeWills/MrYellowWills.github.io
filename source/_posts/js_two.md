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


### Reflect 删除或是否有 某属性
Object的某些方法挪移到 Reflect上；
```
Reflect.has
Reflect.deleteProperty
```
### proxy
![](/image/bk/proxy.jpg)

### 深拷贝
改进前：
```js

function declone(obj, map=new WeakMap()){
    if(map.has(obj)){
        return map.get(obj)
    }
    // 用这个obj.constructor代替  var newObj = {} ,可以避免数组拷贝的问题
    var newObj = obj.constructor();
    map.set(obj, newObj)
    Object.entries(obj).reduce((acc, [key, value])=>{
        if(!obj.hasOwnProperty(key)) return acc;//这句话貌似没有用，不过很多方法写了这个，就放这里吧，避免未知bug
        if(typeof value === "object"){
            acc[key] = declone(value, map)
            return acc;
        }
        acc[key] = value;
        return acc;
    }, newObj)
    return newObj
}

```

改进后：
  // 这里不写 typeof value === "object" 进行逻辑分离，
    // decloneModify 不光满足object，还可以满足 非复杂类型，满足一切类型的拷贝
```js


function decloneModify(obj, map=new WeakMap()){

    if(obj instanceof RegExp) return new RegExp(obj);
    if(obj instanceof Date) return new Date(obj);

if(obj === null || typeof obj !== 'object') {
    //如果不是复杂数据类型，直接返回
    return obj;
}

if(map.has(obj)){
    return map.get(obj)
}
// 用这个obj.constructor代替  var newObj = {} ,可以避免数组拷贝的问题
 /**
     * 如果obj是数组，那么 obj.constructor 是 [Function: Array]
     * 如果obj是对象，那么 obj.constructor 是 [Function: Object]
     */
var newObj = obj.constructor();
map.set(obj, newObj)
Object.entries(obj).reduce((acc, [key, value])=>{
    if(!obj.hasOwnProperty(key)) return acc;//这句话貌似没有用，不过很多方法写了这个，就放这里吧，避免未知bug
    
    // 这里不写 typeof value === "object" 进行逻辑分离，
    // decloneModify 不光满足object，还可以满足 非复杂类型，满足一切类型的拷贝
    acc[key] = decloneModify(value, map)
    return acc;
}, newObj)
return newObj
}
```

引入 WeakMap 是为了解决 循环引用问题，
另外还要考虑加上这两种类型：
```js
// 不直接 return obj，而用new RegExp(obj) 包一层，是为了避免对象的引用类型问题，
// 用new RegExp(obj) 创造一个值一样的，完全一样的RegExp对象
 if(obj instanceof RegExp) return new RegExp(obj);
 if(obj instanceof Date) return new Date(obj);
```
更多，请参考 https://juejin.cn/post/6844903858645237767#heading-24


## js黑知识

### 数组的toString、join与==
数组的 toString 接口默认调用数组的 join 方法，重写数组的 join 方法。
```js
let a = [1, 2, 3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3); //true
```

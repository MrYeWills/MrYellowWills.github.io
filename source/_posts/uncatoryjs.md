---
title: 未分类
date: 2022/2/22
tags: 其他
categories: 
- 其他
series: 其他
---



## js

### 其他
#### 数组的 toString 接口
数组的 toString 接口默认调用数组的 join 方法，重写数组的 join 方法。
```js
let a = [1, 2, 3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3); //true
```

#### Reflect 删除或是否有 某属性
Object的某些方法挪移到 Reflect上；
```
Reflect.has
Reflect.deleteProperty
```
#### proxy
![](/image/bk/proxy.jpg)

#### 深拷贝
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

### 源码阅读经验

以 tapable 为例子


测试用例 可以看 `test.js`;

不要直接看源码，建议 通过vscode debug 上面的 `test.js`;

然后源码以 SyncHook 为准，
了解整个脉路；

这样看源码的方式，效率比较快。


看源码，最好先懂如何使用；

懂了如何使用，
再根据具体示例，
调试源码
这样就可以研究源码了

如何使用不好理解的话，可以去网上找相关视频看看，这样就比较清晰了。

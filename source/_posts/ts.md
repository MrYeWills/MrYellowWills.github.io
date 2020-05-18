---
title: typescript 笔记
date: {{ date }}
tags: [typescript]
categories: 
- typescript
series: typescript
---
## 写在前面
本文是主要参考 [TypeScript 入门教程](https://ts.xcatliu.com/)，记得很随意，断断续续，不完整，可能后期此篇笔记会删除，聊当暂时性自用。
## 接口
### 任意属性的类型必须包含其他属性类型
```js
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}
```
### 多个任意属性如何定义？

## 函数
### 用接口定义函数的形状
```js
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```
与此相对应：
```js
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

## class类作为类型
### 直接用类作为类型
```js
class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}

function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}
```
### 用类作为接口
```js
interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}
```

## as的使用 - 类型断言
```js
function getCacheData(key: string): any {
    return (window as any).cache[key];
}
interface Cat {
    name: string;
    run(): void;
}
const tom = getCacheData('tom') as Cat;
tom.run();
```


## 类型别名
```js
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```
```js
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
```

## 函数的两种类型定义方式
### 接口定义
```js
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```
### 普通定义
```js
// 
const cc : ()=>string = ()=> ''
interface Cat {
    name: string;
    run(): void;
}

```

## 类与接口 - implements
```js
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```




---
title: ts把玩系列(三):温故知新
date: 2022/6/21
tags: [typescript]
categories: 
- typescript
series: typescript
---


本篇是重温之前的ts学习笔记，记录有趣的点。


## 基本知识

### 函数这样使用泛型
```ts
interface ILength {
    length: number
}

function getLength <T extends ILength >(arg: T): T{
    return arg;
}

getLength<unknown[]>([])

// 原本直接使用即可：
 getLength([])
//  现在加了 <unknown[]>
 getLength<unknown[]>([])

//  如果直接使用，我觉得，ts应该会推导出 `unknown[]`

```

### 接口定义class类（implements）
用于给类定义属性的类型。

```js
interface Alarm {
    alert(): void;
}
class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```
### 用类修饰接口（接口可以继承类）
常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的：
```jsx
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
//Point看成实例就很好理解了
interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```


## 函数

### 类型定义的三种方式

#### 常用方式
```ts
type Func2 =((name: string) => string)
```
#### declare
```ts
// 因为
declare function func(name: number): number;
```
#### 用接口定义
```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

### 重载
多种形式或同种形式，针对同一个函数名，多次定义类型，就称之为 重载;
重载有个特性：
取重载函数的 ReturnType 返回的是最后一个重载的返回值类型。
详细参考[类型编程综合实战二 - 函数重载的三种写法](https://juejin.cn/book/7047524421182947366/section/7061543892180533283)
如果要调试相关内容 参考《函数的重载、逆变、协变调试》
```ts
declare function func(name: string): string;
declare function func(name: number): number;
type t1 = {name:string};
type t2 = {age:number};
type Func2 =((name: t1) => string) | ((name: t2) => number);

type cc = Func2 extend (a: infer yy)=>un ? 
```

## ts与react结合使用
### withRouter
```js
import React from "react";
import { Image, Typography } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {
  id: string | number;
  size: "large" | "small";
  imageSrc: string;
  price: number | string;
  title: string;
}

const ProductImageComponent: React.FC<PropsType> = ({
  id,
  size,
  imageSrc,
  price,
  title,
  history,
  location,
  match
}) => {
  // console.log(history)
  // console.log(location)
  // console.log(match)
  return (
    <div onClick={() => history.push(`detail/${id}`) }>
    </div>
  );
};

export const ProductImage = withRouter(ProductImageComponent);

```

### createContext

```ts
import React, { FC, useState, createContext, CSSProperties } from 'react'

interface IMenuContext {
  index: string;
  onSelect?: (selectedIndex: string) => void;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];  
}

//createContext  可以接收一个泛型 IMenuContext
// 如何理解 createContext 既是一个js函数，又可以接收泛型参数进行类型运算
export const MenuContext = createContext<IMenuContext>({index: '0'})

// 常规的类型运算：
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
type PickRes = Pick<{name: 'dong', age: 18, sex: 1}, 'name' | 'age'>;
```




## ts调试技巧

### 如何查看keyof的值
```js

var dd1 = {aa:1, cc:123}
type dd21 = typeof dd1
// 打印如下：
type dd21 = {
    aa: number;
    cc: number;
}
type dd2 = keyof typeof dd1  //type dd2 = "aa" | "cc"



interface cc {
    aa: number;
    cc: number;
}
type dd213 = keyof cc  //type dd213 = keyof cc  
// 为什么不是 上面的"aa" | "cc"，
// 目前猜到的原因是 一个是 interface 一个type；

```

### 函数的重载、逆变、协变调试
示例展示了 函数逆变、协变调试，以此可以类推 函数的重载调试分析。
```ts
type t1 = {name:string};
type t2 = {age:number};
type Func21 =((name: t1) => string) | ((name: t2) => object);
type argtest = Func21 extends (a: infer arg)=> infer returnval ? arg:1
type returnvaltest = Func21 extends (a: infer arg)=> infer returnval ? returnval:1
// type argtest = t1 & t2  //展示了逆变现象  （函数入参会出现协变现象）
// type returnvaltest = string | object  //展示了协变现象 （函数返回值会出现协变现象）

declare const func31: Func21;
func31({name:'1', age:1});
```


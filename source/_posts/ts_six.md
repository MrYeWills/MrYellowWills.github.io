---
title: ts把玩系列(三):温故知新
date: 2022/6/21
tags: [typescript]
categories: 
- typescript
series: typescript
---


本篇是重温之前的ts学习笔记，记录有趣的点。

## 待研究
《如何查看keyof的值》
有空查看 interface 与 type 区别， 可参考《如何查看keyof的值》 示例；

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
---
title: 再读 typescript 笔记
date: 2021/7/20
tags: [typescript]
categories: 
- typescript
series: typescript
---

## 泛型的使用
### 定义类，要多一步
![](/image/ts/cla.jpg)
```ts

class Queue<T> {
  private data = [];
  push(item: T) {
    return this.data.push(item)
  }
  pop(): T {
    return this.data.shift()
  }
}

const queue = new Queue<number>()
queue.push(1)
console.log(queue.pop().toFixed())

const queue2 = new Queue<string>()
queue2.push('str')
console.log(queue2.pop().length)

```

### 定义接口，要多一步
![](/image/ts/cla1.jpg)
```ts
interface KeyPair<T, U> {
  key: T;
  value: U;
}
let kp1: KeyPair<number, string> = { key: 123, value: "str" }
let kp2: KeyPair<string, number> = { key: 'test', value: 123 }

let arr: number[] = [1, 2, 3]
let arrTwo: Array<number> = [1, 2, 3]

interface IPlus<T> {
  (a: T, b: T) : T
}
function plus(a: number, b: number): number {
  return a + b;
}
function connect(a: string, b: string): string {
  return a + b
}
const a: IPlus<number> = plus
const b: IPlus<string> = connect
```

## 声明文件

### tsconfig.json 解决ts无法获取声明
```json
//tsconfig.json
{
    "include": ["**/*"] //告诉编译器，编译当前文件夹下所有ts文件，ts文件就会获得声明 
}
```

### DefinitelyTyped github
[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)这个库是集中管理 ts 声明库文件的，
任何如 antDesign 要做声明文件，就要向这个 DefinitelyTyped 中提 PR 审核。

在[TypeSearch这里](https://microsoft.github.io/TypeSearch/)可以查询使用的库是否有声明文件。使用外网访问，不然查询不到。


## 配置文件

### 配置文件说明demo一

```js
//下面是 tsconfig.build.json
{
  "compilerOptions": {
    "outDir": "dist", //输出目录
    "module": "esnext",  //使用 es 模块标准，即 import export
    "target": "es5", //编译成es5
    "declaration": //true, 是否要生成声明文件
    "jsx": "react", //打包编译的是react，可选值还有 react-native 等
    "moduleResolution":"Node", //编译的路径 选择 node 的策略， 即常用的相对路径，绝对路径
    "allowSyntheticDefaultImports": true, //设置为true时，import策略为 import React form 'react' 而非 import * as React form 'react'
  },
  "include": [
    "src"  //只编译 src下
  ],
  "exclude": [ //不包含以下文件
    "src/**/*.test.tsx",
    "src/**/*.stories.tsx",
    "src/setupTests.ts",
  ]
}
```


### tsconfig.json 技巧：去除定义 any的报错
有些项目，如果不定义类型，就会报错ts，此时如果定义 `"noImplicitAny": "false"` 就可以不用定义any，ts也不会报错了。

```js
//下面是 tsconfig.json
{
  "compilerOptions": {
    "noImplicitAny": "false", //不需要显式地声明变量的类型 any，
  },
}
```

### tsconfig.json 技巧：使用import
```js
//下面是 tsconfig.json
{
  "compilerOptions": {
     "moduleResolution":"Node", //使用import语句时，需要定义这二者，待进一步考证？
     "resolveJsonModule": true, 
  },
}
```

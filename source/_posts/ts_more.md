---
title: 再读 typescript 笔记
date: 2021/7/20
tags: [typescript]
categories: 
- typescript
series: typescript
---
## 泛型

### 泛型就是T这个字符
#### 概述
下面的T就是泛型，或者泛型变量，
我们要使用一个变量来定义类型，就要新建一个泛型变量，
新建泛型变量的方式是`<>`;
创建出来的泛型变量，就可以被当成 类型如number string 一样使用了： 
```ts
function echo<T>(arg: T): T {
  return arg
}
const result = echo(true)
```

没有不使用泛型变量定义类型时：
```ts
function echo(arg: boolean): boolean {
  return arg
}
const result = echo(true)
```
#### 泛型就是一种 number string
number string 是通用的 类型。
如果你要用自定义的类型，
那是不是要自己创建；
创建好了此泛型，即可跟 number string一样使用；

如果你要用自定义的类型 泛型T，
那你是不是要自己创建 `<T>`；
从此即多了一种类型 T ，也是泛型T，，即可跟 number string一样使用；

此创建也类似js的var let const，定义好后，就可以被后面使用；

#### 使用泛型前，肯定要先创建(声明)
使用泛型前，肯定要先通过 `<>` 创建(声明)；
就好比js中，要想使用一个变量，先要 var 声明(创造)；
因此 `<>` 相当于 var 。

因此使用泛型时，创建泛型一定是在最开始的，也就是说 `<>` 一定是在前的。

#### 泛型之于`<>`好比 js 至于 var
参考以上分析。

#### 泛型就是泛泛类型，无所不能的类型
泛型是相对于 number 这些具体单一类型而言的。
泛型是百变类型，百搭类型，
相当于扑克牌中的一个大小王；
百搭各种牌。

### 泛型的两层意思
理解泛型 ：
一 泛型是泛泛之数据类型，百搭数据类型，相对于单一类型如number而言；
二 泛型需要通过 `<>` 创建；

了解以上之后，泛型就很简单，它就是一个百搭类型，
任何需要定义类型的地方 都可以与之配合使用；
好比任何可以用如number类型来定义类型的地方，都可以与之配合使用；
比如 接口，类 等等

### 泛型的使用
#### 定义类，要多一步
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

#### 定义接口，要多一步
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


## 基础知识

### 联合类型产生意义

#### 使用联合类型解决报错
![](/image/ts/all0.jpg)
```ts
type NameResolver = () => string
type NameOrResolver = string | NameResolver
function getName(n: NameOrResolver): string {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}
```
#### 不使用联合类型报错
![](/image/ts/all.jpg)

## 黑知识
### 断言的传统与快捷写法
![](/image/ts/quick.jpg)
```ts
function getLength(input: string | number) : number {
  // const str = input as String
  // if (str.length) {
  //   return str.length
  // } else {
  //   const number = input as Number
  //   return number.toString().length
  // }
  if((<string>input).length) {
    return (<string>input).length
  } else {
    return input.toString().length
  }
}
```

## 声明文件

### ts会默认读取d.ts文件

#### 默认任意目录下都会被读取
ts会默认读取项目下所有的d.ts文件，无论在哪个目录存放 d.ts文件
```ts
//jQuery.d.ts
declare var jQuery: (selector: string) => any
```
一般定义d.ts文件后，项目内所有的ts文件都可以获得此声明，用于编译，
但也有不行的时候，可以创建tsconfig.json，告诉ts，将声明用于项目下所有的ts文件。
#### tsconfig.json 解决ts无法获取声明
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

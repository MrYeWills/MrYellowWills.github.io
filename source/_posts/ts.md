---
title: typescript 笔记
date: 2020/5/1
tags: [typescript]
categories: 
- typescript
series: typescript
---
## 写在前面
本文是主要参考 [TypeScript 入门教程](https://ts.xcatliu.com/)，记得很随意，断断续续，不完整，可能后期此篇笔记会删除，聊当暂时性自用。
## 把玩ts的正确姿势
任意目录下，使用tsc命令来，很纯粹，剔除其他因素导致的理解偏差，不需要配合webpack等等，更多参考：《tsc命令的使用》

## 接口
### 可以描述的类型
#### 定义对象
##### 有很多个属性时，定义一个任意属性
```js
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

const test:Person={
    name:'qianqian',
    age:18,
    intrest:'dance',
    beatiful:'yes',
}
```

#### 定义class类（implements）
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
#### 定义函数（范型接口、普通接口）
参考《范型》

#### 约束范型类型
参考《范型》

### 接口定义方式
#### 常规接口定义
这里就不写了，比较简单。
#### 用类修饰接口（接口可以继承类）
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
[参考 - 将一个父类断言为更加具体的子类](https://ts.xcatliu.com/basics/type-assertion.html)
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

## 范型
参考 [慕课视频](https://www.imooc.com/video/21306)
### 范型类型
```ts
// <T>(arg1:T,arg2:T)=>T 这个表达式称之为 数据类型／范型类型／范型函数
```
#### 范型类型是干嘛的
我们知道声明变量时，我们需要定义类型，普通的类型如 number string等；
还有高级点的类型，如范型类型；
因此范型类型与 number一样，都是用于定义变量的类型。

以下两种方式都可以定义一个范型类型
```ts
// <T>(arg1:T,arg2:T)=>T 这个表达式称之为 数据类型／范型类型／范型函数
// let addFunc : <T>(arg1:T,arg2:T)=>T; //不使用花括号
// let addFunc : {<T>(arg1:T,arg2:T):T}; //使用花括号，将=>改为冒号:
```
#### 不使用花括号
如上
#### 使用花括号
如上，它的特征是，将=>改为冒号:。
#### 范型类型与number等一样
范型类型与number等一样，同属于变量类型，参考上面讲解，这里单独提出来是让对范型类型有一个更加直观认识；
### 范型接口

#### 为什么要有范型接口
```ts
let addFunc : {<T>(arg1:T,arg2:T):T}; 
```
如上，给变量定义类型，太不优雅了，是否可以将范型类型赋给一个变量呢:
```ts
const ftype = {<T>(arg1:T,arg2:T):T} //语法报错
//const ftype = <T>(arg1:T,arg2:T)=>T //语法报错
let addFunc : ftype; 
```
噢，终于知道无法将范型类型赋值给一个变量，因为范型类型只能通过接口来定义，
这种定义范型类型的接口，我们称之为 范型接口或含范型的普通接口。

我们将上面的范型类型赋值给接口GenAdder：
```ts
 interface GenAdder {<T>(arg1:T,arg2:T):T};
 let addFunc : GenAdder;
```

#### 含范型的普通接口
这是普通接口，虽然接口内有范型T，但，接口名后未紧随`<T>`;
```ts
interface GenAdder {<T>(arg1:T,arg2:T):T};
```
#### 转化为范型接口
我们也可以将上面普通接口的T从花括号后，提取出来，放在GenAdder后，GenAdder即转化为范型接口；
```ts
interface GenAdder<T> {(arg1:T,arg2:T):T};
```
#### 含范型的普通接口的使用
二者在ts中应用的区别：
```ts
// 普通接口
interface GenAdder {<T>(arg1:T,arg2:T):T};
let addFunc : GenAdder;
addFunc = function (arg1, arg2){
    return arg1+arg2;//ts报错，当参数为number或string时，成立，当参数为undefined、null时候不成立；
};
addFunc('','')
```

#### 范型接口的使用
为了解决上面的ts报错，必须将普通接口转化为范型接口，因为范型接口在声明类型时，会预设上类型：
```ts
interface GenAdder<T> {(arg1:T,arg2:T):T};
//预设上类型为number
let addFunc : GenAdder<number>;
addFunc = function (arg1, arg2){
    return arg1+arg2;
};
addFunc(1,1)
```
#### 范型接口的使用说明
**范型接口使用时，必须在接口后定义好`<类型>`**，
我们也可从接口定义的外观来理解：
定义接口时，若接口后紧挨着一个`<T>`，则使用此接口时，必须是 `接口名<T>`；
若接口后是干干净净的，没有任何其他东西，则使用此接口时，应该为单纯的 `接口名`
```ts
 interface GenAdder<T> {(arg1:T,arg2:T):T};
//使用范型接口时，需定义好T类型
 let addFunc : GenAdder<number>;

interface nomalGenAdder{ name:string;};
//使用普通接口时，不需定义好T类型，因为没有T
 let addObj : nomalGenAdder;
```
### 范型类
#### 包含范型类型的普通类
如下Adder是个普通类，因为它的属性add使用了范型类，它还是一个普通类，只是内部包含了范型类型定义。
这样的写法在某些情况下写起来比较费劲，也有些情况需要避免一些报错，等等，于是就想将普通类改造成范型类。
```ts
class Adder{
    add:<T>(arg1:T, arg2:T)=>T;
}
const adder = new Adder();
adder.add = function add(arg1, arg2){
    return arg1+arg2;
}
//原则上需要定义<number>
adder.add<number>(1,2)
adder.add<string>('','')
// 不定义<number>也可以，ts默认给定义
adder.add('','')
```
#### 范型类
改造上面的代码，经过改造后如下，Adder就是一个范型类了。
将普通类改成范型类的好处是，写起来可能会优雅点，然后可以处理一些普通类会遇到的ts报错。
另外一方面，从下面我们也知道，一旦定义成范型类，那么调用类时，就需要马上指定好类型。
```ts
//将范型提取出来挨着Adder
class Adder<T>{
    add:(arg1:T, arg2:T)=>T;
}
//调用的时候需要<number>，一旦定义成范型类，那么调用类时，就需要马上指定好类型。
const adder = new Adder<number>();
adder.add = function add(arg1, arg2){
    return arg1+arg2;
}
adder.add(1,3)//正确
adder.add(1,'')//报错
```
#### 范型类调用方式--需指定好类型
如上面的普通类，调用时，直接调用，改成范型类时，就需要指定好类型了：
```ts
const adder = new Adder<number>();
```
#### 扩展-范型函数
既然有普通类和范型类，那么就有普通函数和范型函数，用法可以类推范型类。

### 范型约束
#### 为什么要有范型约束
[参考ts入门教程-范型约束](https://ts.xcatliu.com/advanced/generics.html#%E6%B3%9B%E5%9E%8B%E7%BA%A6%E6%9D%9F)
在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法：
```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);
    return arg;
}
// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'T'.
```
#### 范型的特性导致了必然需要范型约束
参考上面。
#### 使用普通接口做范型约束
注意的是，范型约束使用**普通接口**而非什么范型接口来约束范型。
```ts
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```
#### extends
用于约束范型的关键字，参考上面。

#### 进阶 - keyof
使用keyof进行范型约束，
```ts
function getProp<T, K>(obj:T,key:K){
    return obj[key]//ts error,obj内不一定有key
}
```
此时可通过 keyof来约束 K，改造如下：
```ts
function getProp<T, K extends keyof T>(obj:T,key:K){
    return obj[key]
}
getProp({name:1}, 'name')
```
keyof主要表示 k是T内的属性。
[参考](https://www.imooc.com/video/21306/0)

## tsconfig.json
### strictNullChecks
严格类型，让代码区分null undefined的空与非空类型；不再有包含；
### 开启tsx的支持
定义tsconfig.json的 jsx为preserve；
### esModuleInterop 开启export default
当ts报错import或export时；
或者ts混合使用commonjs与es6模块报错时；
可能是没有export default有关，此时可以设置不同的esModuleInterop来解决；
### noImplicitAny 定义对象不能有any类型属性
```js
const student = {};
const key = 'name';
student[key] = 'qianqian'//ts error
```
## tsc命令的使用
### 安装使用
```
npm install typescript -g
tsc -v
```
### 生成tsconfig.json
```
tsc --init
```
### 编译ts文件
在根目录下，新建一个test.ts，运行如下命令，就会在根目录下生成编译后生成的文件 test.js
```
tsc test.ts
```

## 其他
### d.ts文件
详见《ts中使用commonjs规范与es6规范的不同》

### as的使用 - 类型断言
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

### type 别名
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

## FAQ

### ts中使用commonjs规范与es6规范的不同
[参考慕课网](https://www.imooc.com/video/21605/0)
如下图，使用commonjs时，可以正常使用css module；
但使用es6的import来css module时，必须定义d.ts文件；
还有一个情况，就是下图中第一行 全局css的写法，import单纯引入一个文件时，也是不报错的；

这是因为，当ts import 一个css文件时，这样是没问题的；
但使用es6语法，需要ts 将一个css文件当成对象，将此css文件抽象成一个styles对象时；
ts是不认识的，此时，就需要告诉ts，这个css文件暴露出来的是一个styles对象；如何告诉呢，就是通过d.ts文件；
另外一方面，如果ts中使用commonjs的语法来获取styles时，则不需要定义d.ts文件，因为commonjs规范时webpack默认的规范；

css modlue 折射了 ts 通过es6 将一个文件当成一个对象引入时，需要定义dts文件；为此，其他的比如jquery，lodash都需要做声明文件d.ts.
![](/image/ts/cssmodule.jpg)
![](/image/ts/css.jpg)
![](/image/ts/dts.jpg)

### ts中引入css modlue异常的问题
详见《ts中使用commonjs规范与es6规范的不同》

### null undefined 是所有类型子集
一个变量定义为number后，再定义成string，会报错，但定义为undefined或null不报错；
因为undefined和null都是空类型，其他非空类型都包含此空类型；
```ts
let height:number
height = 100;
height = 'str';//error
height = undefined;//不报错
height = null;//不报错
```

## 参考
[慕课网 - TS封装播放器组件](https://www.imooc.com/learn/1243)
[当React遇上TypeScript开发Antd组件](https://www.imooc.com/learn/1234)
[TypeScript 入门教程](https://ts.xcatliu.com/)











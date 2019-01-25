---
title: js设计模式(及面向对象、闭包、命名空间)
date: {{ date }}
tags: [js设计模式, 命名空间, 面向对象, 闭包]
categories: 
- js
series: js
---

js设计模式之前需要了解js的面向对象编程、闭包、命名空间编程模式的概念

# js的面向对象编程

注意，这里说的是js的面向对象编程，非java面向对象编程。js的面向对象编程与java是有区别的。

## 概念

js面向对象编程的核心概念是 类 和 实例(对象)。
类 在es6上就是 class类，在es5中就是构造函数中定义一系列的propoty原型
实例 就是 new class类，或者 new 构造函数。实例就是对象。
而定义类，最后实例化这个类，都是为了得到这个实例对象。重点最终是对象。这就是面向对象的编程。

简单说，js面向对象编程，就是熟悉使用 class类 来进行js编程。
由于react框架的流行，组件都是通过class类编程，因此熟练使用 js的面向对象编程变得更加重要。

注意的是，js的面向对象编程与java是有区别的。

## new 的理解

关于new 的理解：

```
var obj = new Base();
//new操作符具体干了什么呢?其实很简单，就干了三件事情：
var obj  = {};
obj.__proto__ = Base.prototype;
Base.call(obj);
```

下面将讲 面向对象编程三大特征 多态，继承，封装

## 多态

js的多态与java的面向对象多态不同。

js的多态定义：对同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。
以上通俗点的定义就是：对同一个函数作用于不同对象时（也就是同一个函数，接受不同的对象作为参数时），函数执行的结果不同。

列举多态的几个例子：
```
//最简单的：
var  a  =  5;
console.log(a);
a="str";
console.log(a)
```
```
//最经典的：
var makeSound = function(animal) { // 把不变的部分隔离出来
    animal.sound();
};
    
var Duck = function() {};
Duck.prototype.sound = function() {
    console.log("嘎嘎嘎");
};
var Chicken = function() {};
Chicken.prototype.sound = function() {
    console.log("咯咯咯");
};
makeSound( new Duck() ); // 嘎嘎嘎
makeSound( new Chicken() ); // 咯咯咯
```
多态的思想实际上是把“做什么”和“谁去做”分离开来，达到 开放-封闭的设计原则。

## 继承

### 原型浅拷贝的痛点
所有new实例将指向构造函数原型上的引用类型，造成浅拷贝问题，一个实例修改了此引用类型，其他所有实例受此影响。
```
 function Super(){
    this.colors = ['red','blue','green'];
}
Super.prototype.apples = {};

function newF(o, constructor){
    o.__proto__ = constructor.prototype;
    constructor.call(o); 
}
var aa = {};
var bb = {};
newF(aa, Super);
newF(bb, Super);
console.log(aa.apples === bb.apples)//true
console.log(aa.colors === bb.colors)//false
```
以上过程代码等效于：
```
 function Super(){
    this.colors = ['red','blue','green'];
}
Super.prototype.apples = {};

var aa = new Super();
var bb = new Super();
console.log(aa.apples === bb.apples)//true
console.log(aa.colors === bb.colors)//false
```

以上说明了，构造函数 new出来的所有实例，他们会针对同一个构造函数prototype对象被赋值，如果prototype对象里面有引用类型，那么将相互影响，结合上面代码，这情况等同于：
```
 Super.prototype = {apples:{}};
aa.__proto__ = Super.prototype 
//等同于
aa.apples = Super.prototype.apples
```

### es5继承
#### 套路
es5继承方法有类继承和原型继承，我们不用去管他们叫什么名字和概念是什么，他们的套路无非三种：
1、代理函数(proxy)的构造函数内让父构造函数call一次，就会重写覆盖父构造函数内属性，以此来避免浅拷贝问题。
2、将父函数的new 实例对象 赋值给代理函数的prototype。
3、将父函数的prototype 赋值给代理函数的prototype。

#### 方式
通过以上套路，大致有以下两种方式实现继承：
方式一
```
//方式一，将父函数的new 实例对象 赋值给代理函数的prototype，弊端 会执行两次父函数
 function Super(){
    this.colors = ['red','blue','green'];
}
Super.prototype.apples = {};

function proxy(){
    //执行一次父函数Super
     Super.call(this);
}
//方式一 proxy.prototype直接赋值 new 构造函数
proxy.prototype = new Super();//执行第二次父函数Super
var aa = new proxy();//次步代码 会 重写覆盖父构造函数内属性
var bb = new proxy();
console.log(aa.colors === bb.colors)//true
```

方式二、此方式与方式一一样，其他代码与方式一都一样，只有一句不同

```
//方式二，相比方式二的好处在于 父函数 只执行一遍
 ...
proxy.prototype = Super.prototype
 ...
```

#### 弊端
以上方式都无法解决 prototype 对象的 浅拷贝问题。原因见 《所有new实例将浅拷贝原型上的引用类型 》

#### es5最佳继承方式一：与深拷贝函数结合
传统的继承方式都无法解决prototype的浅拷贝问题，只能引入深拷贝函数，如下代码的deepcopy深拷贝方法，网上有很多，可以去找。
所以es5方法写继承最佳方式：父函数.call + proxy.prototype = deepcopy(Super.prototype).
简言之 call + 原型赋原型 + 深拷贝 
作用：
call 拷贝 构造函数内属性
原型赋原型 拷贝原型方法，避免执行一次父函数
深拷贝 避免原型浅拷贝问题

```
function Super(name){
    this.colors = ["red","blue","green"];
}
Super.prototype.apples = {};
function Sub(name){
    Super.call(this);
}
Sub.prototype = deepcopy(Super.prototype);
```

#### es5最佳继承方式二：引用对象不写入父原型上
es5继承的痛点是无法原型浅拷贝问题，如果能引用对象不写入父原型上，则可放心继承。

### 最终极方式：es6 class
class是es6 的api，是一个语法糖，使用class进行继承，能够轻松进行继承，且无浅拷贝问题。
因此推荐使用es6的class类继承方式，代码优雅而简洁，不推荐使用es5。

```
class Super {
  constructor(){
    this.colors = [];
  }
}
class Sub extends Super{
  constructor(){
    super();
  }
}
var instance1 = new Sub();
var instance2 = new Sub();
console.log(instance1.colors === instance2.colors);//false
```



## 封装

封装这个最好理解，直白的说就是：
封装说的就类。类由一系列的方法和属性组成，将一系列的方法和属性封装起来，封装成一个类。
```
class People {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    eat() {
        alert(`${this.name} eat something`)
    }
    speak() {
        alert(`My name is ${this.name}, age ${this.age}`)
    }
}
```







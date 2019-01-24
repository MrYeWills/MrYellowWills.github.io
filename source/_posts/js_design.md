---
title: js设计模式(以及面向对象、闭包、命名空间)
date: {{ date }}
tags: [js设计模式, 命名空间, 面向对象, 闭包]
categories: 
- js
series: js
---

js设计模式之前需要了解js的面向对象编程、闭包、命名空间编程模式的概念

## js的面向对象编程

注意，这里说的是js的面向对象编程，非java面向对象编程。js的面向对象编程与java是有区别的。

### 概念

js面向对象编程的核心概念是 类 和 实例(对象)。
类 在es6上就是 class类，在es5中就是构造函数中定义一系列的propoty原型
实例 就是 new class类，或者 new 构造函数。实例就是对象。
而定义类，最后实例化这个类，都是为了得到这个实例对象。重点最终是对象。这就是面向对象的编程。

简单说，js面向对象编程，就是熟悉使用 class类 来进行js编程。
由于react框架的流行，组件都是通过class类编程，因此熟练使用 js的面向对象编程变得更加重要。

注意的是，js的面向对象编程与java是有区别的。

### 面向对象编程三大特征

#### 多态

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

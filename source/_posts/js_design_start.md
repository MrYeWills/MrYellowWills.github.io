---
title: js设计模式上(面向对象、闭包、命名空间)
date: {{ date }}
tags: [js设计模式, 面向对象, 闭包, 命名空间]
categories: 
- js
series: js
---

js设计模式分两篇来写，此为上篇。下篇为《js设计模式下》。
js设计模式之前需要了解js的面向对象编程、闭包、命名空间编程模式的概念。

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

### 关于new
[关于new 的理解](https://blog.csdn.net/zhouziyu2011/article/details/60143385)：

```
var baseObj = new Base();
//new操作符具体干了什么呢?其实很简单，就干了三件事情：
var obj  = {};
var result = Base.call(obj);
obj.__proto__ = Base.prototype;

if (typeof(result) === "object"){
  baseObj = result;
}else{
  baseObj = obj;
}
```

下面是两个例子：
```
var Test = function(){
            this.html = 1111;
            // return {a:123};
          }
          var obj = new Test()
          console.log(obj) //{html: 1111}
```

```
var Test = function(){
            this.html = 1111;
            return {a:123};
          }
          var obj = new Test()
          console.log(obj) //{a: 123}
```
### new Fn() 与 new Fn的区别
function Fn(){
    this.name='weide';
}
console.log(new Fn) //Fn {name: "weide"}
console.log(new Fn()) //Fn {name: "weide"}
看起来二者没有区别，在构造函数Fn不用传参的时候，他们确实没有区别，只有当构造函数需要传参的时候，
才必须使用小括号：new Fn()

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

# 闭包

[关于闭包详细知识，可参考我在几年前写的一篇博客，这里只摘取一些必要知识](https://blog.csdn.net/ybdt1201/article/details/53366613)，以下内容基本摘至这篇博客，如有疑问，点击进入了解。
## 定义

官方对闭包的定义：所谓“闭包”，指的是一个拥有许多变量和绑定了这些变量的环境的表达式（通常是一个函数），因而这些变量也是该表达式的一部分。

还有一种对闭包更直接明了的说法：[闭包就是有权访问另一个函数作用域中变量的函数。](https://www.cnblogs.com/tinkbell/p/3173293.html)
分析这句话:
　　1.闭包是定义在函数中的函数.
　　2.闭包能访问函数内的私有变量.
　　3.即使包含函数执行完了, 被闭包引用的变量也得不到释放.

满足以上定义的，都可称之为闭包。

## 三种定义方式
闭包有三种定义方式，一种就是经典的return方式，一种就是new的方式，一种就是对象方式。
我目前看到的闭包就这三种，基本这三种满足了工作中绝大部分需求了。
网上有很多人列举了很多闭包方式，其实本质上都是对这三种方式的发展延伸而已。

### return方式
这种方式最经典，也最为常用，推荐这种写法。
```
function a() {
    var num = 1;
    return function (){
        num++;
        console.log(num);
    }
}
```
### new 方式
这种方式之所以被认定为闭包，是因为以下两点理由，下面代码中：
1、a是母函数
2、inc是a执行后返回，相当于return的函数，此函数绑定了a的私有变量n， 这是决定inc是否为闭包的重要依据。
```
function a(){
  var n = 0;
  this.inc = function () {
    n++;
    console.log(n);
  };
}
var cc = new a();
cc.inc()//1
cc.inc()//2
```
### 对象方式
下面两个闭包例子，套路都一样，外层定义个对象，然后在母函数内部给这个对象定义一个函数，此函数绑定了私有变量，即为闭包函数。
我们姑且称这种定义闭包的方式为对象方式吧。
以下方式之所以被认定为闭包，是因为以下两点理由，下面代码中：
1、有母函数（下面两个例子母函数是匿名函数，当然也可以定义为非匿名函数）
2、母函数执行后，给函数绑定了母函数的私有变量n， 这是决定内部函数是否为闭包的重要依据。
```
var obj = {};
(function() {
    var n = 1;
    obj.count = function () {
                    n++;
                    console.log(n);
                 };
    
})()
obj.count();//2
obj.count();//3
```
```
var divDom = $('#name');
(function() {
    var n = 1;
    divDom.onclick = function () {
                    n++;
                    console.log(n);
                 };
    
})()
divDom.onclick();//2
divDom.onclick();//3

```

## 不是闭包的设计
列举一下非闭包的设计方式，以此加深对闭包的理解
很多人认为自运行匿名函数、命名空间设计模式和原型定义方式都是闭包，我觉得是不对的。

### 自运行匿名函数：
```
//这不是闭包
(function fn(){
          var n = 8;
           console.log(n) ;
      })();
```
```
//这一种是闭包的设计，但并不是因为它是自运行匿名函数的原因，而是因为匿名函数内部return了一个函数的原因，
//这其实就是上面讲的两种闭包设计模式的第一种 return方式
(function fn(){
      var n = 8;
      return function(){
          console.log(n) ;
      }
  })();
```
### js的命名空间写法
js的命名空间写法不能称之为闭包，它最多是使用了js关于引用对象一处改变，都受改变的特性。
```
//这是命名空间的写法，但不是闭包
var obj = {
  n:8,
  count:function(){
    this.n++;
    console.log(this.n);
  }
}
obj.count()//9
obj.count()//10
```
### 原型定义方式
还有一些把函数定义在原型上，这本质上也是运用了引用对象的特性，不是闭包：
```
//这不是闭包，是运用了引用对象的特性，才有对象元素值叠加的效果
function a(){
  this.n = 8;
}
a.prototype.count=function(){
  this.n++;
  console.log(this.n);
}
var obj = new a();
obj.count()//9
obj.count()//10
```
 如果稍微换一下，就行不通了
```
//这不是闭包
function a(){
  this.n = 8;
}
a.prototype.count=function(){
  this.n++;
  console.log(this.n);
}
var newCount = (new a()).count;
newCount()//NaN
newCount()//NaN
```

## 闭包的用处

### 定义私有变量
若不想某些变量被其他函数访问，就可以写一个闭包设计，将变量定义为私有变量，只有闭包函数可以访问，达到其他函数无法访问的目的。

### 保存变量值
这是闭包最经典和关键意义所在，也是闭包函数存在的意义。闭包函数绑定了母函数的变量，每次执行完，此变量不销毁，达到保存变量值的目的。

## 运用场景
### 保存变量值。
### 进行前后两次执行时的比较。
#### react-redux的props状态比较
比如react-redux就是通过闭包的这个特性，保存prop上一次状态，然后跟当前props比较。
#### 节流和防抖
这是性能优化经常使用的手段，可以网上查阅，都是用闭包来进行。
#### for循环的使用
错误写法，这种for达不到预期
```
//错误写法
function foo(){
    var arr = [];
    for(let i = 0; i < 2; i++){
        arr[i] = function(){
            return i;
        }
    }
    return arr;
}
var bar = foo();
console.log(bar[0]());//2    
```
为什么是2？
如下当for循环中定义的变量i，不光是for循环体内的变量，还是foo函数体内的块级变量，当for循环执行完后，会将函数体内的变量i赋值为2，此时调用函数，肯定打印为2.
for循环体内：
```js
 var arr = [];
for(let i = 0; i < 2; i++){}
function test(){
    console.log(i)
}
console.log(i)//2
test();//2
```

正确写法：
```
//正确写法
//为什么能记住当时值，是因为是自运行的函数，每次都会执行一次
function foo(){
    var arr = [];
    for(var i = 0; i < 2; i++){
        arr[i] = (function fn(j){
            return function test(){
                return j;
            }
        })(i);
    }
    return arr;
}
var bar = foo();
console.log(bar[0]());//0 
```
换一种写法，可能更容易理解
```
//正确写法
function foo(){
    var arr = [];
    for(var i = 0; i < 2; i++){
        arr[i] = (function fn(j){
            var _j = j;//定义一个变量，更容易理解
            return function test(){
                return _j;
            }
        })(i);
    }
    return arr;
}
var bar = foo();
console.log(bar[0]());//0 
```
## 对闭包的误解
很多人认为闭包会增加内存，导致内存泄漏，这是错误的，是对闭包的误解。
如果你不把变量定义为闭包访问的私有变量，你也一定会把这些变量定义在全局作用域上，全局作用上下文也是不销毁的，一样也是增加了内存。
所以闭包并没有增加内存，更没有内存泄漏。
如果增加了内存和内存泄漏，其实都是编码水平有待提高导致。


# 命名空间模式

js使用命名空间模式设计，主要是为了避免命名冲突。
命名空间设计模式有很多，工作中最常用的是 对象字面量表示法 的设计模式。其他命名空间模式，我觉得应该用的不多，知道一下即可，这里不展开，可以网上查，[也可参考此篇文章](https://www.cnblogs.com/syfwhu/p/4885628.html)。

## 对象字面量表示法
对象字面量表示法是命名空间设计模式的一种，用得最广，代码如下：

```
//对象字面量表示法 的命名空间设计模式
var myApplication = {
    // 可以很容易的为对象字面量定义功能
    getInfo:function() {
        // ***
    },
    // 可以进一步支撑对象命名空间
    models:{},
    views:{
        pages:{}
    },
    collections:{}
};
```

## 命名空间与设计模式区别

很多人命名空间的设计模式，是js 单例的设计模式，其实二者完全是两样东西。
命名空间偏向于是一种编程规范的设计；
js的一些设计模式，例如单例、观察者模式，更多的偏向功能实现方案的js设计模式。如设计绑定和监听时，选择观察者设计模式。
所以说，命名空间是一种编程规范，设计模式(如单例，以下设计模式都为这种含义)是一种功能实现的设计方案。

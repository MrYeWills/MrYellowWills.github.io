---
title: js设计模式
date: {{ date }}
tags: [js设计模式, 单例模式, 观察者模式, 状态模式, 单一职责原则, 开放封闭原则, 舍弃高效率而取可移植性]
categories: 
- js
series: js
---

js设计模式分两篇来写，此为下篇，上篇为 《js设计模式序(面向对象、闭包、命名空间)》。
主要讲设计原则与设计模式两部分。

# js设计原则

js设计原则有四五个，但真正在js编程中的用得最多的差不多就两个：单一职责原则、开放封闭原则。
另外在本节的最后部分，附上《unix／linux 设计哲学》书中提到的几个linux的编码准则，列举其中对js编码有启发意义的几个。

## 单一职责原则

### 概念
单一职责原则：一个对象（方法）只做一件事情。
单一职责原则要求我们在写复杂方法时，将方法进行抽象，分离颗粒化成多个方法，让每个方法只做一件事情。
### 优缺点
优点：让一个方法只做一个事情，将复杂职责分解为多个职责，后期维护代码的时候，修改其中一个职责，也就不会影响其他职责，这样代码可读性、可维护性、可扩张、可移植性更好，也更符合开放封闭原则。
缺点：增加编写代码的复杂度（能写出单一职责设计原则代码的程序员，也是要求他有一定编程水平才能写出的），当我们按照职责把对象分解成更小粒度之后，实际上也增大了这些对象之间相互联系的难度。

单一职责原则是js编写代码最重要的两个准则之一，在它的优点面前，它的缺点不值得一提。

## 开放封闭原则

### 概念
开放封闭原则：对扩展开放，对修改封闭。
开放封闭原则要求我们写出来的方法，当对程序方法进行扩展时，更加方便，不要修改原来的行为方法。

通过一段代码来体现 开放封闭原则：
```
// 这是原代码，此代码相比之下，每次扩展都需要修改makeSound方法，违反了开放封闭原则
//每次扩展时，因为要修改公共方法makeSound，你还要担心有回归测试的一些问题，还要去测试Duck和Chicken
var makeSound = function(animal){
  if(animal instanceof Duck){
    console.log('嘎嘎嘎');
  }else if(animal instanceof Chicken){
    console.log('咯咯咯');
  }
}
var Duck = function(){}
var Chicken = function(){}
makeSound(new Duck);
makeSound(new Chicken);
```

```
// 这是改良后代码，此代码相比之下，每次扩展都不用修改makeSound方法，更加易于扩展，而且makeSound是一个公共的方法，
//每次扩展时，因为不用修改公共方法makeSound，就不会担心有回归测试的一些问题，不用担心还要去测试Duck和Chicken
var makeSound = function(animal){
  animal.sound();
}
var Duck = function(){}
Duck.prototype.sound = function(){
  console.log('嘎嘎嘎');
}
var Chicken = function(){}
Chicken.prototype.sound = function(){
  console.log('咯咯咯');
}
makeSound(new Duck);
makeSound(new Chicken);

//增加新需求，添加一个Dog行为
var Dog = function(){}
Dog.prototype.sound = function(){
  console.log('汪汪汪');
}
makeSound(new Dog);
```

### 优缺点
优点：从上面代码例子中看到，开放封闭原则的代码，后期可维护性更高，扩展性更强，当有扩展新功能时，风险更小，要做的回归测试问题更少，因此维护、扩展成本更低。
缺点：在项目刚开始时，因为业务不熟，或业务不稳定，因此你很难抽象出 方法中永远变化的部分和永远不变化的部分进行封装。

### 接受第一次愚弄
为了解决上面说的缺点，一种现实的做法是，在项目刚开始时，我们假设方法的所有部分都是不变化的，不对方法进行开放封闭进行抽象封装处理，项目初期快速编码完成需求，不影响项目进度。
当后期变化发生时，再来回过头来封装这些变化地方，确保下一次不会掉进同一个坑里。
我们将这条编码经验称之为 ‘接受第一次愚弄’，但永远不会被同样的招数击倒第二次。


## unix／linux 设计哲学 的 几条准则
准则1:小即是美
准则2:让每个程序只做好一件事情
准则3:快速建立原型（快速更早将功能骨架做好，先让用户用起来，然后客户边用边反馈，开发根据这个实施开发客户反馈需求）
准则4:舍弃高效率而取可移植性（硬件升级或浏览器内核升级后，原来不高效的写法，因为计算机硬件提高，原来不高效写法不影响效率了）
准则5:充分地抽象封装程序，以此达到程序复用性


# js设计模式

## 单例模式

### 定义
单例模式 定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。


### 标准单例模式示例
标准的单例模式示例，如下代码符合单例模式的几点定义：
- Singletom是一个类；
- new Singletom 是它点实例；
- 全局范围内，可通过Singletom访问这个类。

```
//标准的单例模式示例
var Singletom = function(name){
            console.log(name)
          }
Singletom.getInstance = (function(){
var instance = null;
return function(name){
    if(!instance){
    instance = new Singletom(name);
    }
    return instance;
}
})()
var a = Singletom.getInstance('sven1');
var b = Singletom.getInstance('sven2');
console.log(a === b)//true

```

### 优化的标准示例

上面的标准示例，将new 实例和 管理是否有无两个功能放在一个函数内，违背了 单一职责原则，在此改造下：
```
//优化后的单例模式示例
var CreateDiv = function(html){
          this.html = html;
          this.init()
          }
          
CreateDiv.prototype.init = function(){
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
}

var ProxySingletonCreateDiv = (function(){
    var instance;
    return function(html){
    if(! instance){
        instance = new CreateDiv(html);
    }
    return instance;
    }
})()
var a = new ProxySingletonCreateDiv('sven1');
var b = new ProxySingletonCreateDiv('sven2');
console.log(a === b)//true

```

### 通用的单例模式示例

我们不必拘泥于单例模式的定义，单例模式必须要求是一个类 和 实例，
其实类也是一个函数，实例其实就是对call或apply的应用，我们不必拘泥于new 实例，大可 将 函数的直接执行 来 代替实例。
单例模式的精神就是：
- 有一个全局的函数（类）
- 此函数被执行或被实例一次
满足了以上两个条件，都可以称之为单例设计模式；
下面写了一个经典 单例模式示例：

```
//优化后的单例模式示例
var num = 0;
var CreateDiv = function(...args){
    num ++;
    console.log(args[0],`一共执行了${num}次`);
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
    return div;
}
ProxySingletonCreateDiv 专门用来管理 函数是否执行
var ProxySingletonCreateDiv = function(fn){
    var instance;
    return function(){
    if(! instance){
        instance = fn.apply(this, arguments);
    }
    return instance;
    }
}
var a = ProxySingletonCreateDiv(CreateDiv);

a('单例模式')//单例模式 一共执行了1次
a('单例模式')//单例模式 一共执行了1次

//如果我们要扩展，增加一个CreateFrame，只需这样做,非常容易扩展
var CreateFrame = function(...args){
    console.log(args[0]);
    return true;
}
var f = ProxySingletonCreateDiv(CreateFrame);
f('单例模式')//单例模式 一共执行了1次
f('单例模式')//单例模式 一共执行了1次

```

### 应用场景
购物车，登陆，redux 的 store都是单例模式的运用。

### 如何写一个单例模式
由上面例子看到，写一个单例模式的功能，基本上要借助闭包来实现。
通过上面的例子看到，在单例模式中，请将管理单例 和 功能函数 分开编写。


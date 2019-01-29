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


## 观察者模式

### 示例
#### 设计思路
对上面例子解说，
新闻公司通过 暴露出来一个接口attach，用来给订阅者(观察者)报名或参加订阅，
新闻公司内部，用以下几个属性用来记录情况：
this.foodState ---- 将要推送的 食品消息
this.houseState ---- 将要推送的 房产消息
this.foodObservers ---- 食品消息订阅者个人信息
this.houseObservers ---- 房产消息订阅者个人信息
this.deliveryType ---- 将要推送的消息的类别
deliveryState ---- 推送消息
notifyAllObservers  ---- 给每个订阅者打电话将消息通知给订阅者
getState ---- 暴露给订阅者的API,订阅者接到通知消息的电话后，可通过公司提供的渠道网站或短信来看新闻

订阅者：
订阅者用以下几个属性来记录情况
this.phoneNum ---- 订阅新闻需要提供给新闻公司的 手机号码
this.subscribeType  ---- 订阅新闻需要提供给新闻公司的 新闻类别
this.company  ---- 用来保存公司资料，刚开始是根据公司提供的报名方式attach进行报名，后期新闻发送消息是，
                   可以通过公司提供的渠道(this.company.getState)查看消息，也可以针对新闻服务公司的服务态度，给公司反馈或投诉建议
this.company.attach 通过公司对外暴露的接口，登记报名订阅。

cellphone 订阅者对外暴露给新闻公司自己接收消息的方式。

#### 示例小结
新闻公司必须 对订阅者暴露 订阅方式attach；
订阅者必须 对公司暴露 接收消息方式cellphone；
因为订阅者要 保存公司的资料，例如获取订阅方式等等，所以订阅者必须设计一个属性用来保存公司这个对象总类；
因为公司要 保存订阅者的资料，例如获取订阅者的接收方式等等，所以公司必须设计一个属性用来保存订阅者完整类；

因为公司要 发送消息deliveryState，就要用一个属性来保存将要发的消息foodState，然后要执行打电话通知notifyAllObservers，
通知完后，还要提供网站或app或短信等渠道getState，让订阅者查看新闻。

#### 示例代码
```
// 主题，接收状态变化，触发每个观察者

class NewsCompany {
    constructor() {
        this.foodState = 0
        this.houseState = 0
        this.foodObservers = []
        this.houseObservers = []
        this.deliveryType = 0
    }
    getState() {
        if(this.deliveryType === 'food'){
            return this.foodState
        }
        return this.houseState
    }
    deliveryState(state,deliveryType) {
        if(deliveryType === 'food'){
            this.foodState = state
        }else{
            this.houseState = state
        }
        this.deliveryType = deliveryType;
        this.notifyAllObservers(deliveryType)
    }
    attach(observer) {
        if(observer.subscribeType === 'food'){
            this.foodObservers.push(observer)
        }
        if(observer.subscribeType === 'house'){
            this.houseObservers.push(observer)
        }
    }
    notifyAllObservers(type) {
        const observers = type === 'food' ? this.foodObservers : this.houseObservers;
        observers.forEach(observer => {
            //发布消息，给每个订阅者留的电话打电话，通知订阅者
            observer.cellphone()
        })
    }
}

// 观察者，等待被触发
class Observer {
    constructor(phoneNum, subscribeType ,company) {
        this.phoneNum = phoneNum
        //订阅的第一步，就必须获得订阅内容的资料或对象，我们把这个对象看成是新闻服务公司，这个新闻服务公司提供很多种类的新闻：房产新闻，食品新闻，体育新闻。。。。
        this.company = company //必不可少，将公司资料保存下来，可以针对新闻服务公司的服务态度，给公司反馈或投诉建议
        this.subscribeType = subscribeType
        this.company.attach(this)//报名，参加订阅，这一步是不是可以理解为订阅.attach就是公司给订阅者的报名方式
    }
    //cellphone 新闻服务公司，有消息时会打电话给每个订阅者，cellphone模拟的是订阅者手机接到电话的行为
    cellphone() {
        console.log(`${this.phoneNum} 收到, state新闻: ${this.company.getState()}`)
    }
}
// 测试代码
let newsCompany = new NewsCompany()
//对于新闻服务公司来说，他只需要知道 订阅者 电话号码 和 订阅内容即可，一个人可以有很多特性，例如名字，性别，爱好等等，
//但对于新闻服务公司而言，它只需要知道订阅者的 手机号码 和 新闻类别，所以一个订阅者的对象，只需要具备手机号码和订阅新闻类别两个属性即可。
//所以我们上面设计的订阅者类Observer，只有phoneNum, subscribeType 两个属性。
//从观察者的角度看，它还需要 一个属性来将公司资料保存下来，可以针对新闻服务公司的服务态度，给公司反馈或投诉建议
//基于以上，一个订阅者，需要设置三个属性，而cellphone是公司打电话来时，模拟订阅者手机接到电话的行为
let o1 = new Observer('15099281126', 'food', newsCompany)
let o2 = new Observer('15099281127', 'food', newsCompany)
let o3 = new Observer('15099281128', 'food', newsCompany)
newsCompany.deliveryState('奶制食品新闻','food');//给每个订阅者发布消息

let o7 = new Observer('13899761271', 'house', newsCompany)
let o8 = new Observer('13899761272', 'house', newsCompany)
let o9 = new Observer('13899761273', 'house', newsCompany)
newsCompany.deliveryState('房产新闻','house');//给每个订阅者发布消息
```

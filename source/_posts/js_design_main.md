---
title: js设计模式下
date: {{ date }}
tags: [js设计模式, 单例模式, 观察者模式, 状态模式, 单一职责原则, 开放封闭原则, 舍弃高效率而取可移植性]
categories: 
- js
series: js
---

js设计模式分两篇来写，此为下篇，上篇为 《js设计模式上(面向对象、闭包、命名空间)》。
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


## 其他准则
下面是unix／linux 设计哲学 的 几条准则，对js编程依然有借鉴：
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

### 将以上 标准单例模式示例 优化

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

上面我们解释了标准的单例模式，这样可以更加容易理解单例模式是什么，在实际应用中，我们更偏向使用基于以上标准单例模式改造而来的通用的单例模式。
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
观察者模式也称为发布订阅模式
### es6示例
#### 设计思路
对下面例子解说，
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

cellphone 订阅者对外暴露给新闻公司自己接收消息的方式，用来update。

#### 示例小结
新闻公司必须 对订阅者暴露 订阅方式attach；
订阅者必须 对公司暴露 接收消息方式cellphone；
因为订阅者要 保存公司的资料，例如获取订阅方式等等，所以订阅者必须设计一个属性用来保存公司这个对象总类；
因为公司要 保存订阅者的资料，例如获取订阅者的接收方式等等，所以公司必须设计一个属性用来保存订阅者完整类；

因为公司要 发送消息deliveryState，就要用一个属性来保存将要发的消息foodState，然后要执行打电话通知notifyAllObservers，
通知完后，还要提供网站或app或短信等渠道getState，让订阅者查看新闻。

#### 示例代码
此代码针对上面解说而写的，此示例代码的好处是可以很好地先理解好观察者到底是一个什么东西。
但此代码也有弊端，例如NewsCompany不易维护性，NewsCompany中维护了food，house，如果将来增加了money等等呢，需要改写NewsCompany内部。所以NewsCompany需要进一步优化。
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
    //cellphone 新闻服务公司，有消息时会打电话给每个订阅者，cellphone模拟的是订阅者手机接到电话的行为，很多示例中将cellphone写作update，不过为了方便理解，在此写成cellphone
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

#### 优化及延伸方式一
对示例代码优化及延伸方式一：
上面代码不易扩展，将上面代码优化：NewsCompany中去掉constructor，并且改写food与house切换，将cellphone改为callback不再统一管理callback：

```
class NewsCompany {
    deliveryState(state,deliveryType) {
        this[`${deliveryType}State`] = state;
        this.deliveryType = deliveryType;
        this.notifyAllObservers()
    }
    attach(observer) {
        const {subscribeType} = observer;
        if(!this[`${subscribeType}Observers`]){
            this[`${subscribeType}Observers`] = [];
        }
        this[`${subscribeType}Observers`].push(observer);
    }
    notifyAllObservers() {
        const observers = this[`${this.deliveryType}Observers`];
        observers.forEach(observer => {
            observer.callback(this[`${this.deliveryType}State`], this, observer)
        })
    }
}

// 观察者，等待被触发
class Observer {
    constructor(phoneNum, subscribeType ,company, callback) {
        this.phoneNum = phoneNum
        this.subscribeType = subscribeType
        this.callback = callback
        company.attach(this)//报名，参加订阅，
    }
}

let newsCompany = new NewsCompany()
//state, newsCompany, observerMyself 将newsCompany和observerMyself都传给callback，以备不时之需
let o1 = new Observer('15099281126', 'food', newsCompany, (state, newsCompany, observerMyself)=>{
    console.log(`15099281126 收到, state新闻: `,state)
})
let o2 = new Observer('15099281127', 'food', newsCompany, (state, newsCompany, observerMyself)=>{
    console.log(`15099281127 收到, state新闻: `,state)
})
let o3 = new Observer('15099281128', 'food', newsCompany, (state, newsCompany, observerMyself)=>{
    console.log(`15099281128 收到, state新闻: `,state)
})
newsCompany.deliveryState('奶制食品新闻','food');


let o7 = new Observer('13899761271', 'house', newsCompany, (state, newsCompany, observerMyself)=>{
    console.log(`13899761271 收到, state新闻: `,state)
})
let o8 = new Observer('13899761272', 'house', newsCompany, (state, newsCompany, observerMyself)=>{
    console.log(`13899761272 收到, state新闻: `,state)
})
let o9 = new Observer('13899761273', 'house', newsCompany, (state, newsCompany, observerMyself)=>{
    console.log(`13899761273 收到, state新闻: `,state)
})
newsCompany.deliveryState('房产新闻','house');
```

#### 优化及延伸方式二
对示例代码优化及延伸方式二：
你会发现上面的phoneNum其实可有可无，NewsCompany保持跟上面不变，改造其他部分：
删除phoneNum,
将attach提取出来，
删除Observer类，直接用参数来代替，
参数因为可能会超过3个改成options对象方式容易扩展

```

let newsCompany = new NewsCompany()
//state, newsCompany, observerMyself 将newsCompany和observerMyself都传给callback，以备不时之需
newsCompany.attach({
    subscribeType : 'food', 
    callback: (state, newsCompany, observerMyself)=>{
      console.log(`o1 订阅或观察者 收到, state新闻: `,state)
    }
})
newsCompany.attach({
    subscribeType : 'food', 
    callback: (state, newsCompany, observerMyself)=>{
      console.log(`o2 订阅或观察者 收到, state新闻: `,state)
    }
})
newsCompany.attach({
    subscribeType : 'food', 
    callback: (state, newsCompany, observerMyself)=>{
      console.log(`o3 订阅或观察者 收到, state新闻: `,state)
    }
})
newsCompany.deliveryState('奶制食品新闻','food');

```

此时，你是否可以将attach想象成 addEventListener，deliveryState想象成fire或trigger。


### es5示例
由于js天生可以很优雅地使用花括号来构造一个对象，而不用通过class实例化，因此我们可很容易通过es5来写一个观察者与订阅模式示例：

#### 示例代码
```
var Event = (function(){
    var ClientList = {},
    listen,
    trigger,
    remove;
    listen = function(key, fn){
        if(!ClientList[key]){
            ClientList[key] = []
        }
        ClientList[key].push(fn);
    }
    trigger = function(){
        var key = Array.prototype.shift.call(arguments),
        fns = ClientList[key];
        if(!fns || fns.listen === 0){
            return false;
        }
        for(var i = 0; i<fns.length; i++){
            fns[i].apply(this,arguments);
        }
    }
    remove = function(key, fn){
        var fns = ClientList[key];
        if(!fns){
            return false;
        }
        var fns = ClientList[key];
        if(!fn){
            fns && (fns.length = 0);
        }else{
            for (var l = fns.length -1;l>0;l--){
                var _fn = fns[l];
                if(_fn === fn){
                    fns.splice(l,1);
                }

            }
        };
       
    }
    return {listen,trigger,remove}
})()

Event.listen('squeremeter88', function(price){
    console.log('价格= '+price);
})
Event.listen('squeremeter88', function(price){
    console.log('价格_111= '+price);
})
Event.trigger('squeremeter88', 20000);
```

当业务复杂后，可能出现命名污染的现象，这个时候，我们可以改写Event，通过Event.creat(namespace).listen(add),
Event.creat(namespace).trigger(add),详细可看 《js设计模式》书

#### 应用场景：

一个按钮被点击时，出发一个div显示最新的count值。
```
<body>
<button id="count">click</button>
<div id="show"></div>
<script>
var a = (function(){
    var count = 0;
    var button = document.getElementById('count');
    button.onclick = function(){
        //Event 就是上面的Event不变。
        Event.trigger('add', count++)
    }
})()
var b = (function(){
    var div = document.getElementById('show');
    Event.listen('add', function(count){
        div.innerHTML = count
    })
})()
</script>
</body>
```
### 应用场景
网页事件绑定，promise的一系列then，还有react的生命周期函数其实都是定义callbase，是一种观察者模式

### 定义
它定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖它的对象都将得到通知。
它的特征是，
- 发布和订阅
- 一对多（包含一对一）
设计的原则：
主题与观察者分离，不是主动触发而是被动监听，两者解耦。

### 小结
上面举例来es6和es5两种方式的观察者模式示例，es6和es5两种方式，各有各的优点，本质上也是一样的，为了便于直观理解观察者模式，可先行记忆es5示例的形式。

### 优缺点
缺点 观察者模式容易隐藏 代码逻辑，过量使用观察者模式，后期后期维护时，可能不好找入口的风险带来一些麻烦。
优点 观察者模式可以用来很好地写异步编程，事件驱动编程。


## 状态模式

### 反例
举例一个常规编程，但这个编程是一个不好的例子--反例，下节会基于此做优化
```
var Light = function(){
    this.state = 'off'
    this.button = null
}

Light.prototype.init = function(){
    var button = document.createElement('button'),
    self = this;
    this.button = document.body.appendChild(button);
    this.button.innerHTML = '开关';
    this.button.onclick = function(){
        self.buttonWasPressed();
    }
}
Light.prototype.buttonWasPressed = function(newState){
   if(this.state === 'off'){
       console.log('弱光');//用console来象征 状态行为
       this.state = 'weakLight';
   }else if(this.state === 'weakLight'){
       console.log('高光');
       this.state = 'strongLight';
   }else if(this.state === 'strongLight'){
       console.log('关灯');
       this.state = 'off';
   }
}
var light = new Light();
light.init();
```

需求来了，如果再增加一个超级强光，那么就要改写buttonWasPressed，违反了开放封闭原则，而且Light.prototype.buttonWasPressed会越来越臃肿，
代码中状态行为只有一句console.log(),但实际开发中，肯定不止这一句代码，基于以上两点理由，因为有必要 改写成下一节的示例代码

### 标准状态模式示例
将上节反例demo改造，优化，以下是标准状态模式demo：
```
//标准状态模式示例
var LightState = function(nextState, stateCallback){
    this.stateCallback = stateCallback;
    this.nextState = nextState;
}
LightState.prototype.buttonWasPressed = function(){
    this.stateCallback();//对应的行为
    this.light.setState(this.nextState) //切换状态
}

var OffLightState = function(light){
    this.light = light;
}
OffLightState.prototype = new LightState('weakLightState', function(){
    console.log('弱光');//自定义对应的行为
});

var WeakLightState = function(light){
    this.light = light;
}
WeakLightState.prototype = new LightState('strongLightState' ,function(){
    console.log('强光');//自定义对应的行为
});

var StrongLightState = function(light){
    this.light = light;
}
StrongLightState.prototype = new LightState('offLightState' , function(){
    console.log('关灯');//自定义对应的行为
});

var LightContext = function(){
    this.offLightState = new OffLightState(this)
    this.weakLightState = new WeakLightState(this)
    this.strongLightState = new StrongLightState(this)
    this.button = null
}

LightContext.prototype.init = function(){
    var button = document.createElement('button'),
    self = this;
    this.button = document.body.appendChild(button);
    this.button.innerHTML = '开关';
    this.currState = this.offLightState; //设置开始状态
    this.button.onclick = function(){
        self.currState.buttonWasPressed();
    }
}
LightContext.prototype.setState = function(newState){
   this.currState = this[newState]
}

var light = new LightContext();
light.init();

```

当增加一个超级强光时：

```
var SuperStrongLightState = function(light){
    this.light = light;
}
SuperStrongLightState.prototype = new LightState('offLightState' , function(){
    console.log('关灯');//自定义对应的行为
});

...
StrongLightState.prototype = new LightState('superStrongLightState' , function(){
    ...
});

var LightContext = function(){
...
    this.superStrongLightState = new SuperStrongLightState(this)
...
}

```


### 状态模式的优缺点
以上就是状态模式的魅力，符合开放封闭原则，可以不让buttonWasPressed臃肿，其实就是不让context无限臃肿。
缺点 会增加代码量，把逻辑分散到状态类中，无法在一个地方就可以将逻辑不能一目了然。

### 设计原则与定义
状态模式，最重要的特征是定义状态类(如上的LightState)，并将逻辑分散到状态类中。
将状态(LightState)与主体(LightContext)分离，状态变化的逻辑单独到每个状态类中(例如OffLightState)处理。

状态模式的定义较晦涩：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
这个定义基本看不懂，可以忽视掉。
状态模式的精髓在于 定义状态类，并状态对应的逻辑封装到状态类中。

### 什么情况下使用
什么情况下使用状态模式，
如上面优缺点说的，
当你不希望Light.prototype.buttonWasPressed太臃肿时；
当每次有新需求你不希望每次都去修改Light.prototype.buttonWasPressed时；
当你做的功能业务有太多状态变化，且每个状态逻辑较多时；
那么就请使用状态模式吧


## 代理模式

### 两者代理模式的概念
js中用得最多的虚拟代理和缓存代理；
虚拟代理指通过代理，将一个函数延迟或等到真正需要执行的时候再执行，说白了就是延时下，例如下面例子中，等图片完全加载好后再执行真正的加载。
缓存代理，如下例子中，指通过代理，不用每次都执行函数，开始执行完函数后，后期从缓存取，如果我计算或2+3，后面再2+3时，直接从缓存取。
代理模式很简单直接通过以下两个例子来领略下代理模式；

### 虚拟代理示例
```
var myImage = (function(){
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src){
            imgNode.src = src;
        }
    }
})()

var proxyImage = (function(){
    var img = new Image;
    img.onload = function(){
        myImage.setSrc(this.src)
    }
    return {
        setSrc:function(src){
            myImage.setSrc('file:// /c:/user/abc.gif');
            img.src = src;
        }
    }
})()

//myImage.setSrc('http://s9.knowsky.com/bizhi/l/20100615/2010112611%20(1).jpg')
proxyImage.setSrc('http://s9.knowsky.com/bizhi/l/20100615/2010112611%20(1).jpg')
```
注意一个现象，myImage有一个setSrc接口，proxyImage也有一个setSrc接口，并且代理函数体内用了myImage.setSrc；

### 缓存代理示例

#### 简单版示例
```
var mult = function(){
    console.log('开始计算乘积');
    var a = 1;
    for (var i =0, l = arguments.length; i<l; i++){
        a = a*arguments[i]
    }
    return a;
}


var proxyMult = (function(){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call(arguments, ',');
        if(args in cache){
            return cache[args];
        }
        return cache[args] = mult.apply(this, arguments)
    }
})()
console.log(proxyMult(1,2,3,4))
console.log(proxyMult(1,2,3,4))
```

#### 延伸版示例

```
var plus = function(){
    console.log('开始计算加和');
    var a = 0;
    for (var i =0, l = arguments.length; i<l; i++){
        a = a+arguments[i];
    }
    return a;
}

var createProxyFactory = function(fn){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call(arguments, ',');
        if(args in cache){
            return cache[args];
        }
        return cache[args] = fn.apply(this, arguments)
    }
}

var proxyMult = createProxyFactory(mult);

console.log(proxyMult(11,2,3,4))
console.log(proxyMult(11,2,3,4))
```

注意一个现象，proxyMult代理函数体内用了fn.apply,且mult与proxyMult接收的参数是一致的，可以认为二者接口一致。

### 设计原则
从上面的示例我们可以看到，
设计一个代理模式，有一个小技巧：
- 就是代理函数 要 提供跟被代理函数一摸一样的接口，或者有一摸一样的接收传参方式；
- 代理函数体内 引用 被代理函数。


## 策略模式

### 定义
策略模式的思想：
定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换。
最代表性和关键的操作是将每种算法单独封装成类，或者函数。

### 经典示例一
下面看一个策略模式最代表的例子：

#### 反例
计算绩效奖金，最开始的写法：
```
// 这是反例
var calculateBonus = function(performanceLevel, salary){
    if(performanceLevel === 'S'){
        return salary*4;
    }
    if(performanceLevel === 'A'){
        return salary*3;
    }
    if(performanceLevel === 'B'){
        return salary*2;
    }
}
calculateBonus('B', 20000);
calculateBonus('S', 6000);
```
上面写法致命缺点在于，将来如果有更多的绩效等级，例如C、D、E、F...时，都需要在calculateBonus中增加代码逻辑；
改进上面代码的关键，在于精简calculateBonus。

#### 标准示例
改进如下：
```
//标准策略模式示例
var S = function(salary){
    return salary*4;
}
var A = function(salary){
    return salary*3;
}
var B = function(salary){
    return salary*2;
}

var calculateBonus = function(func, salary){
    return func(salary);
}
calculateBonus(B, 20000);
calculateBonus(S, 6000);

```
改进后，将每个等级的逻辑封装成单独的类或函数，
无论未来增加多少绩效逻辑，都将单独定义绩效逻辑类，不会影响现有类，同时calculateBonus都不变。
改进用到的策略模式技巧：
- 将算法类直接以算法名字命名

### 经典示例二
如果只需了解 策略模式，只需看以上内容即可，这部分内容只是再举例加深理解。

下面再看一个经典测试模式示例
#### 反例
```
//这是反例
<form action="#" id="registerForm" method="POST">
    请输入用户名：<input type="text" name="userName"/>
    请输入密码：<input type="text" name="passWord" />
    请输入手机号码：<input type="text" name="phoneNumber" />
    <button>提交</button>
</form>
var registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function(){
    if(registerForm.userName.value === ''){
        alert('用户名不能为空');
        return false;
    }
    if(registerForm.userName.length < 6){
        alert('用户名不能少于6位');
        return false;
    }
    if(registerForm.password.length < 6){
        alert('密码不能少于6位');
        return false;
    }
}

```

#### 标准示例
对以上示例进行改进：
- 将每种验证方法 封装成单独的类或函数，如strategies.isNonEmpty;
- Validator可以看作是本节的第一个标准示例中的calculateBonus，
  validataForm可以看作是calculateBonus(B, 20000);
- 将验证Validator分两步逻辑，一步是逐条添加规则，一步是一次性验证所有规则
```
//将一系列 规则算法 封装成单独的函数
var strategies = {
    isNonEmpty: function(value, errorMsg){
        if(!value){
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg){
        if(value.length<length){
            return errorMsg
        }
    },
    isMobile: function(value, errorMsg){
        if(!/13511112222/.test(value)){
            return errorMsg;
        }
    }
}
var Validator = function(){
    this.cache = [];
}
//设计 添加 和 验证 规则的逻辑
Validator.prototype.add = function(dom, rules){
    var self = this;
    for (var i = 0,rule; rule = rules[i++];){
        (function(rule){
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;
            self.cache.push(function(){
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(dom, strategyAry);
            })
        })(rule)
    }
}
Validator.prototype.start = function(){
    for(var i= 0,validatorFunc; validatorFunc = this.cache[i++];){
        var errorMsg = validatorFunc();
        if(errorMsg){
            return errorMsg;
        }
    }
}

//为表单实际添加规则 和 验证
var registerForm = document.getElementById('registerForm');
var validataForm = function(){
    var validator = new Validator();
    validator.add(registerForm.userName,[{
        strategy: 'isNonEmpty',
        errorMsg: '不能为空'
    },{
        strategy: 'minLength:10',
        errorMsg: '长度不能小于10'
    }])
    validator.add(registerForm.passWord,[{
        strategy: 'isNonEmpty',
        errorMsg: '不能为空'
    }])

    var errorMsg = validator.start();
    return errorMsg;
}

registerForm.onsubmit = function(){
    var errorMsg = validataForm();
    if(errorMsg){
        alert(errorMsg);
        return false;
    }
}

```

改进后，这种模式很好的适应了大型项目规则验证。

### 编写策略模式技巧

- 将策略算法 封装成单独函数或类；
- 直接以算法名称 命名 函数和类，如上面经典示例一


## 装饰者模式

主要讲解es5装饰者模式的其中的两种实现方式：一个是定义类(构造函数)的方式，一个是修改超级函数Function原型的方式。
下面对这两种方式分别讲解：

### 构造函数方式
```
var Plan = function(){}
Plan.prototype.fire = function(){
    console.log('发射普通子弹');
}

var MissleDecorator = function(plan){
    this.plan = plan;
}
MissleDecorator.prototype.fire = function(){
    this.plan.fire();
    console.log('发射导弹');
}

var AtomDecorator = function(plan){
    this.plan = plan;
}
AtomDecorator.prototype.fire = function(){
    this.plan.fire();
    console.log('发射原子弹');
}
var plan = new Plan();
plan = new MissleDecorator(plan);
plan = new AtomDecorator(plan);
plan.fire();

```


### Function原型方式

```
Function.prototype.before = function(beforefn){
        var _self = this;//保存原函数的引用
        return function(){//返回包含类原函数和新函数的代理函数
            beforefn.apply(this,arguments);//执行新函数，且保证this不被劫持，新函数接受的参数
            return _self.apply(this, arguments);//执行原函数，并且返回原函数的执行结果，并且保持this不被劫持
        }
    }

    Function.prototype.after = function(afterfn){
        var _self = this;
        return function(){
            var ret = _self.apply(this,arguments);
            afterfn.apply(this,arguments);
            return ret;
        }
    }
    var func = function(param){
        console.log(param);
    }
    func = func.before(function(param){
        param.b = 'b';
    })
    func({a:'a'});//{a:'a', b:'b'}
```

### es6中的修饰器（Decorator）
```
@testable
class MyTestableClass {
  // ...
}
function testable(target) {
  target.isTestable = true;
}
MyTestableClass.isTestable // true
```
注意，修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。

### 小技巧
装饰者，经常用到的小技巧，不改变原函数情况下，增加函数功能：
```
var a = function(){
        alert(1)
    }
    var _a = a;
    a = function(){
        _a();
        alert(2);
    }
    a();
```
在开发中，我们常用这种方式，实现页面回退，加载等等事件时，增加功能。







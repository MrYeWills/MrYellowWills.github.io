---
title: js笔记(一)
date: 2019/5/21
tags: [自运行函数写法形式]
categories: 
- js
series: js
---

## js 常用知识


### 自运行函数

#### 自运行函数的17种写法
```
( function() {}() );
( function() {} )();
[ function() {}() ];

~ function() {}();
! function() {}();
+ function() {}();
- function() {}();

delete function() {}();
typeof function() {}();
void function() {}();
new function() {}();
new function() {};

var f = function() {}();

1, function() {}();
1 ^ function() {}();
1 > function() {}();

;( function() {}() );
```

#### 函数表达式 和 函数声明
要弄懂自运行函数的原理，需弄懂函数表达式 和 函数声明概念；
函数声明，也叫函数定义；
[参考](https://www.cnblogs.com/lenther2002/p/5894964.html)
Javascript中有2个语法都与function关键字有关，分别是：
```
函数声明：function FunctionName(FormalParameterList) { FunctionBody }
函数表达式：function [FunctionName](FormalParameterList) { FunctionBody }
```
从语法的定义上看，这两者几乎是一模一样的（唯一的区别是函数表达式可以省略函数名称），那么就解释器而言，当遇到这个结构的语句时，判定为函数表达式还是函数定义呢？
就javascript的语法而言，如果一条语句是以function关键字开始，那么这段会被判定为函数定义(声明)；
如果不是以function关键字开始，那么就是函数表达式；

**为什么要分清 函数表达式和函数声明呢?**
因为[函数表达式是不能拿来直接用的](https://www.zhihu.com/question/20249179)，必须在**左侧**有字符或表达式与这个函数表达式共同构成一句可执行的函数语句；
（之所以在左侧，不是右侧，是因为在不要行函数语句以关键字function开始，避免被识别为函数声明，导致报错）
函数声明是可以拿过来直接用；
例如：
```
function fn(){}
fn()//不报错；
function (){}() //报错
-function (){console.log(5)}() //不报错 因为在funtion左侧有表达式-
```

#### 16种含函数表达式的不报错的函数语句
结合上节的知识，将《自运行函数的17种写法》整理下，以下17种包含了函数表达式的函数语句不报错,注意的是，
以下函数表达式内的函数体都将不会执行，至于如何执行，下面会讲。

```
( function() {} );
( function() {} );
[ function() {} ];

~ function() {};
! function() {};
+ function() {};
- function() {};

delete function() {};
typeof function() {};
void function() {};
new function() {};

var f = function() {};

1, function() {};
1 ^ function() {};
1 > function() {};

;( function() {} );
```

#### 是否以function开始对js解释器很重要
[参考](https://www.zhihu.com/question/20249179)
以下两种报错形式的原因分析：
- function (){ }()
期望是立即调用一个匿名函数表达式，结果是进行了函数声明，函数声明必须要有标识符做为函数名称。
- function g(){ }()
期望是立即调用一个具名函数表达式，结果是声明了函数 g。末尾的括号作为分组运算符，**必须要提供表达式做为参数**，这个表达式可以是一个值或一个语句，例如改成下面的就不会报错：
```
function g(){ }(1) //不报错，因为末尾的小括号有值作为表达式
function g(){ }(1,2) //不报错
```
以上说明了，是否以function开始对js解释器很重要;
如果以function开始，js解释器会认为它是一个函数声明，此时就要符合函数声明的标准，否则报错；
如果function左侧还有表达式，js解释器会认为它是一个函数表达式，此时该函数表达式配合左右两侧的表达式就构成了一个函数语句,要符合函数语句标准；
（例如 var a = function(){} 这就是一条函数语句）

#### 1种立即执行的函数声明形式
目前知道的，可以让函数声明内的函数体立即执行的只有这种方式：
```
function g(a){console.log(a) }(1) //不报错
```
注意，末尾小括号一定要有 表达式，原因查看《是否以function开始对js解释器很重要》
```
function g(a){console.log(a) }() //报错 
```

#### 如何让函数表达式、声明内的函数体立即执行
如何让 函数表达式和函数声明 内的函数体立即执行呢；
**只能**通过小括号();
例如
```
var a = function(){console.log('work')} //不打印
var a = function(){console.log('work')}() //打印work
```
因此可以认为()是一个让立即执行的运算符，可以让函数表达式或函数声明内的函数体立即执行；

#### 函数表达式、声明 与 立即执行 关系
参看上面的《如何让函数表达式、声明内的函数体立即执行》

#### () 与 立即执行
参看上面的《如何让函数表达式、声明内的函数体立即执行》

#### ()放在哪些位置可以让函数体立即执行
一般而言，() 紧跟在 function(){} 的花括号后面的位置，通过这样的方式让函数表达式或函数声明 内的函数体立刻执行：
```
var a = function(){console.log('work')}()
~ function() {}()
( function() {}() )
function fn(t){console.log(t)}('work')
```
不过有个例外，请看：
```
( function() {}() ); //可以立即执行函数体
( function() {} )(); //()放在了左侧(  )的右侧，不过也可以立即执行函数体
```
()紧跟在中括号后就不行：
```
[ function() {}()]; //不报错，这个函数语句其实就是一个数组
[ function() {}](); //报错，因为[]是一个数组，数组不是方法，类似这种写法，都错：[]()
```

**小结，从目前看，小括号一般紧跟如上的花括号，也可跟在如上的 (  )后面。**现在再回过头，看这《自运行函数的17种写法》应该就明白了吧


#### () 与 函数传参
这个简单，不多介绍，一般自运行传参的方式如下：
```
( function(a) {console.log(a)} )(888) //888
```
注意的是，将()写在里面也是可以传参的：
```
( function(a) {console.log(a)}(888) ) //888
```
#### 分号 ; 与 立即执行
有些人喜欢用分号;来配合函数表达式写一个自运行，;分号本来是用来给函数语句断句的；
所以用这个的好处就是自带断句功能，避免不必要的错误；
```
//会报错
var f = function() {};
f()
( function() {} )();
```
加分号;后不报错
```
//会报错
var f = function() {};
f()
;( function() {} )();
```

#### +，-，！比（ ）立即执行方式少一个字符
通过+，-，！这三个符号运行的匿名函数比（）运行的匿名函数可以减少一个字符的使用
如：
```
( function() {} );
~ function() {};
```
不过这不影响使用(  )还是+，-，！ 配合使用函数表达式，这里只是提取这个现象出来。

#### 难点立即执行的demo分析
```
new(function P(){console.log(1)})()
```
以上相当于
```
new (function P(){console.log(1)})()
```
左侧是new表达式，右侧是一个立即执行的函数；
右侧立即执行的函数其实就是
```
function P(){console.log(1)}
P()
```
所以以上相当于
```
function P(){console.log(1)}
new P()
```
问题：为什么new(function() {})()，new可以与()紧挨着，不用空格；
因为(function() {})()是一个函数表达式语句，可以挨着，也可以不挨着，都不会报错
你把new当成+ - ！ ~来看，就好理解了；
```
~ function() {}; //不紧挨着，不报错
~function() {}; //紧挨着，不报错
```

#### 重要运用之一
```
   var map = document.querySelector('#id')
   map.style.height='600px';
```
相比之下，下面的写法，map变成块级变量，不再污染全局作用域。
```
;(function(){
    var map = document.querySelector('#id')
    map.style.height='600px';
     }())
```
#### 自运行 参考资料
[JavaScript 小括号()分组运算符](http://www.softwhy.com/article-2022-1.html)
[JS中函数定义和函数表达式的区别](https://www.cnblogs.com/lenther2002/p/5894964.html)
[JavaScript 匿名函数有哪几种执行方式?](https://www.zhihu.com/question/20249179)

### js规范写法

#### 给常量起个名
必要的时候，给常量起个名，可读性更强
```
 car.handle('seller','sell',5,true);
```
修改后：
```
var carType = 'seller';
var carName = 'sell';
var sellNum = 5;
var isNeedLoan = true;
car.handle(carType,carName,sellNum,isNeedLoan);
```
### js运行机制
#### 如何理解js的单线程
js的单线程指的是，一个时间内只能执行一个任务。

#### 任务队列
任务队列的任务将被运行栈(执行栈、调用栈)执行

#### event loop (事件循环)
比较多，单独出来分析，参考《event loop (事件循环)》

#### 宏任务与微任务
其实比较简单，参考[这篇讲得好](https://www.jianshu.com/p/a697e9bfdaef)。
大白话，由语言标准提供的就是微任务，比如ES6提供的promise。
当前用得最多微任务也就promise。
其他由浏览器或node运行环境提供的，比如setTimeout、ajax等是宏任务。


#### 理解setTimeout 0
小于4毫秒时，浏览器认为都是0。
```
setTimeout(()=>{}, 2)
```
#### 触发异步任务的API
setTimeout或setInInterval
Dom事件
Promise

### event loop (事件循环)
#### 概述
{% img url_for /image/js/loop.jpg %}
#### 区分出同步、异步任务
浏览器引擎会对所有任务进行识别，会将同步任务放置到运行栈中;
会将其中的异步任务取出放在浏览器的线程中，等待如setTimeout任务的时间到了变成0后，再放到任务队列中；

#### 异步任务时间为0后放入任务队列中
参考上面
#### 运行栈执行同步任务
运行栈也成为执行栈、调用栈。
同步任务放在运行栈中，运行栈只会放置同步任务，运行栈执行的是同步任务；

#### 运行栈与任务队列之间的Loop循环
运行栈执行完后，发现运行栈清空后；
运行栈就从任务队列中取出任务进行执行。
运行栈再次执行完后，发现运行栈中又清空了，
于是运行栈又从任务队列中取出任务进行执行。
如此运行，就是事件循环，也叫Event Loop

### generator yeild
#### 概述
yeild用于单步执行代码；
每执行一次it.next,就会按定义的yeild顺序单步执行到给定的代码中。
```js
function* test(){
    const a = yield 'hel'
    console.log('step one',a);//1
    const b = yield 'wol'
    console.log('step two',b);//66
}
let it = test();
console.log(it.next())//第一次next传参是没有任何意义的//{ value: 'hel', done: false }
console.log(it.next(1))//传递上一次的yield返回值{ value: 'wol', done: false }
console.log(it.next(66))//{ value: undefined, done: false }
```
#### it.next()返回{value,done}
参考《概述》
#### it.next的传参是上一个yeild的值
参考《概述》
### async是 generator+co+promise的语法糖
#### co
[co](https://github.com/tj/co) 是koa作者tj的一个开源库，如下，在read函数内，实现了将异步代码使用同步的方式编写：
```js
const axios = require('axios');

function* read(){
    try {
        let content1 = yield axios.get('http://127.0.0.1:3000').then(e=>{console.log('先执行');return e})
        console.log('step one',content1.data)
        let content2 = yield axios.get('http://127.0.0.1:3000');
        console.log('step two',content2.data)
    } catch (e) {
        console.log('err', e)
    }
}
//co简化版
function co(it){
    return new Promise((resolve, reject)=>{
        function next(data){
            let { value, done} = it.next(data);
            if(!done){
                Promise.resolve(value).then(data=>{
                    next(data);
                })
            }else{
                resolve(data);
            }
        }
        next();
    })
}

co(read()).then(data=>{
    console.log('result',data.data)
})
```
#### 使用async实现
要想实现上面同样的功能：在read函数内，实现了将异步代码使用同步的方式编写，使用async很简单，async底层基于generator+co+promise实现
```js
async function asyncRead(){
    try {
        let content1 = await axios.get('http://127.0.0.1:3000').then(e=>{console.log('先执行');
        console.log('async step one',content1.data)
        let content2 = await axios.get('http://127.0.0.1:3000');
        console.log('async step two',content2.data)
    } catch (e) {
        console.log('err', e)
    }
}

asyncRead()
```
###  手写promise

#### 手写源码要点
- 定义一个构造函数
 - 构造函数内三个状态：pending resolved rejected
 - 定义内部resolve与reject方法
 - reject时候存储value，以便给下个then使用，以此类推reject
- 定义一个原型方法then
- then方法内递归构造函数实现链式调用
- 定义静态方法all、race、resolve等等
- 基于发布订阅模式

除此之外，以下几点要注意：
#### setTimeout内需要重新try catch
尽管,这里已经做了try catch。
```js
  try{
        // 立即同步执行executor
        executor(resolve,reject)
    }catch (e) { // 如果执行器抛出异常，promise对象变为rejected状态
        reject(e)
    }
```
但是setTimeout内还必须加try，因为try catch无法捕捉一个定时器内部函数的错误，因此有定时器时，必须这样：
```js
  try{
        setTimeout(()=>{
                try{
                
                }catch (e) {
                    
                }
                })
    }catch (e) { 
        reject(e)
    }
```
#### 建议使用class而非function原型来做继承
class可以避免原型的浅拷贝问题。
#### reslove\reject是异步因为用了setTimeout
```js
 setTimeout(()=>{
        handle(onResolved)
    })


     function handle(callback) {
                 resolve(result)
            }
```


#### 参考
[珠峰公开课（手写promise - 上）](https://www.bilibili.com/video/BV1AA411h75Q/?spm_id_from=333.788.videocard.0)
[珠峰公开课（手写promise - 下）](https://www.bilibili.com/video/BV1sZ4y1j71K/?spm_id_from=333.788.videocard.1)
[promise 同学笔记）](https://juejin.im/post/6856213486633304078)
[同学源码 ](https://github.com/Sunny-lucking/howToBuildMyPromise)
[demo](https://github.com/YeWills/learns/tree/master/promise)



## Dom API
### 为什么都可绑定事件：dom.onclick=function(){}\dom.addEventListener('click')
这是dom事件级别，这两种方式是新老时代的绑定事件方式，参考《dom事件级别》
### dom事件级别
dom0 时代 ：dom.onclick=function(){}
dom2 时代 ：dom.addEventListener('click', function(){})
dom3 时代，绑定事件方式与dom2相同，不同的是，dom3时代增加了很多事件类型，例如 鼠标事件、键盘事件‘keyup’；
### 事件模型
事件模型有 冒泡和捕获 两种。
### 事件流
[参考](https://www.jianshu.com/p/e7c403e6e2da)
当事件触发时，无论你做了什么，事件都会完整经历捕获、目标处理、冒泡阶段。这里很多人歧义，认为事件只会单独执行捕获或冒泡阶段，这是不对的，事件会完整经历以上三阶段。
只是绑定事件时，可以选择事件在冒泡或捕获阶段触发：
```
//true 捕获， false 冒泡 (默认)， 无论设置为true或false，事件都会执行
document.addEventListener("click", myFunction, true);
```
dom事件流分为三阶段：
#### 捕获阶段
一个事件比如 click，顶级对象window发出一个事件流，事件从window>document>html>body>button到达目标元素。
注意此阶段不出发事件绑定的函数。
#### 目标处理阶段
事件到达目标元素后，目标元素分析传给自己的是什么事件，是click还是change等等事件？确认好事件类型后，开始触发事件对应的绑定函数。
进入冒泡阶段。
#### 冒泡阶段
沿着目标函数一步步到window对象，触发对应事件绑定函数。
#### document.addEventListener
document.addEventListener("click", myFunction, true)的第三个参数 true或false，这第三个参数类似一个转换阀，当为true时，捕获阶段就执行。
当false时，冒泡阶段才执行。

### 事件捕获的具体流程
事件捕获具体流程是window>document>html>body>button。
这也就解释了，很多人将**全局**事件绑定在body或document或window上，放在这些地方，在项目中任何地方都能被捕获触发对应事件函数。
### Event对象常见运用
#### event.preventDefault()
阻止元素的默认行为，例如a标签定义click事件，在事件函数上加上这个，可以阻止a标签跳转。
#### event.stopPropagation()
阻止冒泡或捕获，当元素使用这个的时候，监听事件比如click，所触发的函数就到此为止，再也不会向上冒泡或像下捕获。
#### event.stopImmediatePropagation()
同一个元素绑定同一事件如click多次时，当元素click触发时，所有的click事件全部被触发。
如果不想全部触发绑定的click事件，可以在某个click事件函数中加这个，阻止再触发其他click事件函数。
#### event.currentTarget
获取真正写onclick函数的元素，如下，当点击child1时，通过event.currentTarget获取到的是wrap的dom，通过event.target获取到的是真正被点击的目标元素child1。
```
 <div class="wrap" onclick="function(e){e.target}">
            <div class="child1"></div>
            <div class="child2"></div>
        </div>
```
#### event.target
见《event.currentTarget》
#### 其他
event还有很多其他的作用，比如获取键盘值等等。
### 自定义事件
```
var eve = new Event('abcTest');
dom.addEventListener('abcTest', ()=>{}, false)
dom.dispatchEvent(eve)

```
IE下有一定兼容问题，解决方法很简单，参看mdn关于`new Event`章节。

### 键盘事件
#### keyDown
当用户按下键盘上的任意键时触发，而且如果按住不放的话，会**重复**触发此事件，注意，如果事件可选用keyDown与keyUp时，请使用keyUp，因为它不会重复触发。
#### keyPress
当用户按下键盘上的**字符键**时触发，而且如果按住不放的话，会**重复**触发此事件
#### keyUp
当用户释放键盘上的键时触发,天然地**不会重复**触发
#### 用keyUp代替keyDown
因为keyUp的不会重复触发性，在做键盘事件时，可以选择keyUp，而避免keyDown。
#### 避免this的使用-(同时支持鼠标与键盘事件时)
```js
 var play=document.getElementById('play');
    // 开始抽奖
    play.onclick=playFun;
   // 键盘事件
   document.onkeyup=function(event){
      event = event || window.event;
      if(event.keyCode==13){
        playFun();
      }
   }
function playFun(){
    //最好不要用this，鼠标事件时，this时被点击节点；键盘事件时this指向document
    //this.style.background='#999';
    play.style.background='#999';
}
```

 

## Dom API 黑知识
### 获取dom width 与 内联样式 的关系
#### dom.style.width 只能获取内联样式
dom.style.width 只能获取内联样式，无法获取 通过css给dom设置的width。
这就造成明明dom是有宽高的，但使用dom.style.width获取的高度为0；
解决的方法是，使用 window.getComputedStyle(dom).width 获取，此方法始终能获取宽高度。
#### window.getComputedStyle(dom).width 获取宽高
推荐使用此方法获取dom宽高度。
参考《dom.style.width 只能获取内联样式》
#### dom.getBoundingClientRect().width
此方法是一个dom API神器，能做很多事情，获取宽高度不在话下。

## Jquery
### 为什么jq插件要写在$.fn对象中
本可以将jq插件直接扩展到$.prototype原型上，为什么要在$.fn上呢，原因是为了广大jq用户，有一个统一的接口（fn对象）来进行插件扩展。
这样，大家插件的写法也更加统一。

## 场景运用
### 拖拽的原生实现
#### onmousemove的坐标实时计算
见下面代码
#### clientX 与 offsetLeft
见下面代码
#### 代码
```js
window.onload=drag;

function drag(){
   var oTitle=getByClass('login_logo_webqq','loginPanel')[0];
   // 拖曳
   oTitle.onmousedown=fnDown;
}

function fnDown(event){
  event = event || window.event;
  var oDrag=document.getElementById('loginPanel'),
      // 光标按下时光标和面板之间的距离
      disX=event.clientX-oDrag.offsetLeft,
      disY=event.clientY-oDrag.offsetTop;
  // 移动
  document.onmousemove=function(event){
  	event = event || window.event;
  	fnMove(event,disX,disY);
  }
  // 释放鼠标
  document.onmouseup=function(){
  	document.onmousemove=null;
  	document.onmouseup=null;
  }
}

function fnMove(e,posX,posY){
  var oDrag=document.getElementById('loginPanel'),
      l=e.clientX-posX,
      t=e.clientY-posY,
      winW=document.documentElement.clientWidth || document.body.clientWidth,
      winH=document.documentElement.clientHeight || document.body.clientHeight,
      maxW=winW-oDrag.offsetWidth-10,
      maxH=winH-oDrag.offsetHeight;
  //边界控制
  if(l<0){
    l=0;
  }else if(l>maxW){
    l=maxW;
  }
  if(t<0){
    t=10;
  }else if(t>maxH){
    t=maxH;
  }
  oDrag.style.left=l+'px';
  oDrag.style.top=t+'px';
}
```

## 杂汇
### 合集
#### url编码
```js
encodeURIComponent('骑手管理') //"%E9%AA%91%E6%89%8B%E7%AE%A1%E7%90%86"
decodeURIComponent("%E9%AA%91%E6%89%8B%E7%AE%A1%E7%90%86") //"骑手管理"
```
## 编码技巧

### 判断是否false
```js
const isFalsy = value => value === 0 ? false : !value 
```

### 国际化
这是一个简单的国际化demo：
https://github.com/moT01/react-i18next-demo/tree/solution 
与
git://github.com/verdaccio/ui 

用的技术栈一样：
i18next + react-i18next ；













---
title: js笔记
date: {{ date }}
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
~ function() {}; //不紧挨着，不报错
~function() {}; //紧挨着，不报错

#### 自运行 参考资料
[JavaScript 小括号()分组运算符](http://www.softwhy.com/article-2022-1.html)
[JS中函数定义和函数表达式的区别](https://www.cnblogs.com/lenther2002/p/5894964.html)
[JavaScript 匿名函数有哪几种执行方式?](https://www.zhihu.com/question/20249179)

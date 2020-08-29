---
title: 前端笔记
date: 2019/5/21
tags: [前端, js, html]
categories: 
- 前端
---

## 前端知识
### 浏览器直接使用import (JavaScript modules)
参考《d3图形、demo讲解、使用经验  --   走势图  -- import module 的经典使用》
### 浏览器缓存
#### 概述
浏览器缓存分为强、协商缓存；
上面是根据页面如何利用缓存的态度来分的。
强缓存是指，只要浏览器有这个缓存，页面就直接拿来用，也不去问这个缓存是否最新或改变；
协商缓存是指，页面在用浏览器缓存时，会根据这个缓存的状态，决定是否使用这个缓存。
![](/image/font_end/cache.jpg)
#### 强缓存
解释如上
#### 协商缓存
解释如上
#### 二者区别
- 强缓存返回状态码是200，但不往服务器发请求；
- 协商缓存返回状态码是304，会给服务器发请求；
- 二者的区别也在这个图片上，协商缓存会有 last-modified，if-modified-since 等，强缓存则没有，可依此来判断是否强或协商。
![](/image/font_end/cache.jpg)

### 安全类
#### CSRF 跨站请求伪造
- 原理
CSRF中文称之为 跨站请求伪造。
如下，用户登陆网站A后，获得cookie，
之后，用户再登陆网站B，B站引诱用户访问A网站，
由于这个访问接口与之前的cookie同域名，因此再次访问A网站时浏览器自动带上cookie，
从而访问成功，导致非法转账或者用户数据盗取等等。
![](/image/font_end/csrf.jpg)

- 防御
 - Token 验证：浏览器不会自动给接口带上token，因此后台如果做token验证，是可以避免csrf的。
 - Referer 验证：服务端会比对接口请求的referer(接口的页面来源)，如果不是我这个站点的referer，若不是就阻止。

- 更多
[查看](https://www.bilibili.com/video/BV1Dt411V7ao?p=1)

#### XSS 跨站脚本攻击
- 原理
想网站注入一些js脚本，输入的这些脚本在浏览器端运行，实现攻击，可获取cookie或者串改页面信息以及转账等等。
其特点主要是 利用浏览器端运行 注入的js脚本，因此其防御也与此有关。
- 防御
 - 对用户输入内容进行转义，对脚本语言进行识别过滤。
 - 对cookie等敏感信息进行设置，比如设置cookie 通过js不可读。
- demo
[小demo](https://github.com/YeWills/learns/tree/master/node/xss)


## http知识
### cookie 与 http
参考另外博客《http协议  - cookie》

### post与get区别
1.get在浏览器回退时是无害的，而post会再次提交请求；
2.get请求会被浏览器主动缓存，而post不会，除非手动设置；
3.get请求在url中传送的参数是有长度限制的，而post没有限制；
4.get请求参数会被完整保留在浏览器历史记录中，而post请求参数不会被保留；

其他一些明显区别，在此不列举 。

### http状态码
#### 分类
2xx：成功 --表示请求已被成功接收；
3xx：重定向 --要完成请求必须进行更进一步的操作；
4xx：客户端错误 --请求有语法错误或请求无法实现；
5xx：服务器错误 --服务器未能实现合法请求；
#### 常用状态码
200 ok ： 成功；
206 ：客户发起一个带有range头的get请求，服务器完成了它；（通常用于视频分片段的请求）；
301／302 : 请求的页面已经转移到新的url，前者是永久重定向，后者302是临时重定向；
304 ： 服务器数据无变化，使用浏览器缓存；
401 ： 请求未经授权；
403 ： 禁止访问；
404 ： 请求资源不存在；
500／503 ： 服务器发生错误；

### token

#### token与Authorization关系
Authorization是http的请求头，Authorization的值就是token。
可以说token是定义在http中的Authorization属性上的：
```js
$.ajax({
    url:"http://localhost:3000/api/userInfo",
    beforeSend: function(xhr) { 
                xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTk4Mzg5OTIyLCJleHAiOjE1OTgzOTM1MjJ9.-SgGux78wAT2N9cxNCFOReg9v3EO8XVoH8M_2FzynXU");  
            },});
```
#### 概述
token也成为令牌。
#### jsonwebtoken生成token
参考下面的demo
#### jwt进行token验证
参考下面的demo
#### jsonwebtoken 与 koa-jwt
参考另外一篇博客《koa2笔记 - jsonwebtoken 与 koa-jwt》
#### postman进行token请求
参考博客《0到1快速构建自己的后台管理系统   -- 登陆前端页面获取令牌》
《0到1快速构建自己的后台管理系统   -- postman使用令牌请求》
#### cmd进行token请求
参考下面的demo
#### html进行token请求
参考下面的demo
#### demo
[demo](https://github.com/YeWills/koa-demo/tree/router-Token)

### 三次握手与四次挥手
[参考](https://www.jianshu.com/p/d3725391af59)
### 访问一个url经历了哪些
[参考](https://blog.csdn.net/g291976422/article/details/88984859)
客户端获取URL - > DNS解析 - > TCP连接 - >发送HTTP请求 - >服务器处理请求 - >返回报文 - >浏览器解析渲染页面 - > TCP断开连接
tcp连接属于 传输层，只用于连接，不用于数据收发，
http连接属于 应用层，用于数据收发。

### websocket
[websocket的小demo](https://github.com/YeWills/learns/tree/master/node/websocket)

## js通信
### 同源策略及限制
#### 概述
同源策略是浏览器端做的安全策略。
包含以下特点：
#### Cookie、LocalStaorage和indexDB无法读取；
非同源下，无法读取非同源的以上缓存；
#### DOM无法获取
#### 浏览器屏蔽非同源请求的消息（跨域）

### 前后端如何通信
#### ajax
#### Websocket
#### CORS 
cors是一个新的通信标准
### 如何创建ajax
#### xmlhttpRequest对象的工作流程
#### 兼容处理 （ie）
new XMLHttpRequest 
new window.ActiveXObeject (ie 兼容)
#### 事件触发条件
#### 事件的触发顺序
### 跨域通信的几种方式
#### JSONP
在postMessage与CORS出现前，基本上都是通过jsonp来实现跨域；
jsonp的原理是利用script异步加载实现。
此方法需要后台配合。
实现方法：
- 在script标签中定义一串url，并且使用callback作为关键字，告诉服务器前台已经定义了一个全局函数jsonpCunstomFnName来接收数据。
（callback、jsonpCunstomFnName 这些都可以随便定义，跟后台商量好就行）
```
<script src="http://www.google.com/?data=name&callback=jsonpCunstomFnName"></script>
```
- js代码定义全局函数jsonpCunstomFnName
- 服务器返回一段以下script字符，执行全局函数jsonpCunstomFnName,并且将请求返回数据作为参数；
```
<script>
    jsonpCunstomFnName({
        data:[]
    })
</script>
```

#### postMessage
![](/image/font_end/f-postm.jpg)
#### Hash
```
//利用hash，场景是当前页面A通过iframe嵌入来跨域的页面B
//在A的代码如下
var B = document.getElementsByTagName('iframe')
B.src = B.src + '#' + 'data';

//在B的代码如下
window.onhashchange = function(){
    var data = window.location.hash
}
```
#### websocket
![](/image/font_end/f-webs.jpg)
#### CORS
cors通信必须配合fetch使用。
cors是变种的ajax，浏览器识别到是cors时，自定增加origin参数到请求头中，达到可跨域请求
 ![](/image/font_end/f-cors.jpg)


## 页面优化
### 资源合并、压缩
gzip压缩
### 减少http请求
### 利用浏览器缓存
参考《高效前端》P72
cache-control\last-modified\if-Modified-Since\etag\if-None-Match
### 非核心代码异步加载
#### 异步加载的方式
动态脚本加载(用js创建script标签)，defer，async。
#### defer
defer是在html解析完后才执行，如果是多个，按顺序依次执行；
![](/image/font_end/async.jpg)
![](/image/font_end/async-result.jpg)
#### async
async使用方法与defer相同。
async是在html解析完后才执行，如果是多个，则同时执行多个文件；
### 使用cdn
### 预解析dns
```
//强制打开a标签的dns解析，一般a标签默认开启dns解析，但对于有些浏览器可能没有打开，此时加上这句话可开启。
<meta http-equiv="x-dns-prefetch-control" content="on">
//开启页面预解析dns
<link rel="dns-prefetch"  href="//host_name_to_prefetch.com">
```
### 把css写成内联
css只有10或20k时，写成内联，谷歌和百度和淘宝pc版都是这样干的。
放在内联上，最大的好处是节省了一次cdn请求,从而加快页面响应。
注意只适合css不是非常大的情况。

## hybrid
### 为什么hybrid版本更新方便，更快捷
因为hybrid使用的是js语言开发，相比原生开发使用的java语言，js语言无法操作设备的相机、横屏竖屏、语音、通讯录等等，而java是能操作这些的。所以每当版本更新时，java原生开发要进行代码审核安全验证，js的hybrid则不需要，所以版本更新更加便捷；
### 页面无法直接向服务器发请求，需要原生层面中转
hybrid的js页面的ajax需要调去原生提供的请求API，才能向后端发起请求，所以的ajax请求会经过原生转发
### webview
- 是app中的一个组件（app可以有webview，也可以没有）
- 用于加载h5页面，即一个小型的浏览器内核
## 算法
### 需要了解的算法：
还有兴趣的话，也学习下 冒泡排序：
![](/image/font_end/f-calc1.jpg)
![](/image/font_end/f-calc2.jpg)
![](/image/font_end/f-calc3.jpg)
## FAQ
### 获取并使用字体图标
[可以通过阿里的开源字体库](https://www.iconfont.cn/)使用
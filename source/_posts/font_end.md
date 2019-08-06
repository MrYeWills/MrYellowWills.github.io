---
title: 前端笔记
date: {{ date }}
tags: [前端, js, html]
categories: 
- 前端
---

## 前端知识
### 浏览器缓存
浏览器缓存分为强、协商缓存；
上面是根据页面如何利用缓存的态度来分的。
强缓存是指，只要浏览器有这个缓存，页面就直接拿来用，也不去问这个缓存是否最新或改变；
协商缓存是指，页面在用浏览器缓存时，会根据这个缓存的状态，决定是否使用这个缓存。
![](/image/font_end/cache.jpg)
#### 强缓存
解释如上
#### 协商缓存
解释如上

## http知识
### cookie 与 http
cookie是后台传给前台，前台再利用浏览器的cookie可以随http发回给后台的特性，对发回对cookie进行验证。
- 第一次向后台发起请求后，后台返回的响应头（response headers）包含了给浏览器设置cookie对功能（set-cookie）
![](/image/font_end/cookie.jpg)
- 浏览器拿到cookie后，cookie有个特性，同域名下的cookie在发起请求时，都会发回给后台
- 后台通过比对session的cookie，进行超时、登陆等校验

补充一点cookie知识：
如下图 Expires／max-age 的值为 N／A是session永久有效的意思，另外一个每个cookie对应一个域名。
![](/image/font_end/cookie1.jpg)

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
301／302 : 请求的页面已经转移到新的url，前者是非临时转移，后者302是临时转移；
304 ： 服务器数据无变化，使用浏览器缓存；
401 ： 请求未经授权；
403 ： 禁止访问；
404 ： 请求资源不存在；
500／503 ： 服务器发生错误；

## js通信
### 同源策略及限制
#### 概述
同源策略是浏览器端做的安全策略。
包含以下特点：
#### Cookie、LocalStaorage和indexDB无法读取；
非同源下，无法读取非同源的以上缓存；
#### DOM无法获取
#### ajax请求不能发送（跨域）
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
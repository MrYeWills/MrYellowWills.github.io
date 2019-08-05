---
title: 前端缓存笔记
date: {{ date }}
tags: 前端缓存笔记
categories: 
- 前端缓存笔记
series: 前端缓存笔记
---


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
## 算法
### 需要了解的算法：
还有兴趣的话，也学习下 冒泡排序：
![](/image/font_end/f-calc1.jpg)
![](/image/font_end/f-calc2.jpg)
![](/image/font_end/f-calc3.jpg)
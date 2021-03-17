---
title: 代理 跨域 host代理
date: 2021/01/19
tags: [代理, 跨域, host代理]
categories: 
- 前端工具
series: webpack
---

## webpack代理
### 同域名且同端口才会被匹配
场景，使用第三方组件，第三方组件用了自己一套ajax，且内置了自己的网址做请求，不过对外暴露了host处理，此时为避免跨域，将第三方组件host配置为'a.test360.com:8080'，与webpack启动的域名端口相同。
此时就会被webpack捕获：
```js
new MediaUp({
        browse_button : 'pickfiles',
        filters : {
            mime_types : [
                    { title : "Video files", extensions : "wmv,avi,mpg,mpeg,3gp,mov,mp4,flv,f4v,m4v,m2t,mts,rmvb,vob,mkv"}
                ],
            max_file_size : '30mb'
        },
        snaps:8,//0表示不获取
        host:'a.test360.com:8080'
    });
```
```js
 devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api/proxy': {//第三方组件的请求会被捕获 ： http://a.test360.com:8080/api/proxy/blockAbc.json
        target: 'http://upload.media.test.com:3000',
        changeOrigin: true,
        secure: false,
      }, 
```

### proxy只要任意一处匹配到即可
如下`/proxy`既能匹配到 `/proxy` 还能匹配到 `/api/proxy/` 等等:
```js
 devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/proxy': {//被匹配的有 ： http://a.test360.com:8080/api/proxy/blockAbc.json  与 http://a.test360.com:8080/proxy/blockAbc.json
        target: 'http://upload.media.test.com:3000',
        changeOrigin: true,
        secure: false,
      }, 
```
### 给webpack代理到的域名配置host代理
如上
```js
 devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/proxy': {
        target: 'http://upload.media.test.com:3000',
        changeOrigin: true,
        secure: false,
      }, 
```
host配置如下：
```
127.0.0.1 upload.media.test.com
```
 页面中访问 `http://a.test360.com:8080/api/proxy/blockAbc.json` 时其实相当于访问 `http://127.0.0.1:3000/api/proxy/blockAbc.json`

## 跨域
### 基础知识

#### 跨域的原因

- 浏览器限制
- 跨域
- XHR(XMLHttpRequest)请求

同时满足上面三点，才涉及跨域问题。
以上前两点好理解，第三点 什么是 XHR(XMLHttpRequest)请求？
单独一小节讲解。
一般用ajax 或 fetch 或 axios 请求的都是xhr请求，这些请求是有跨域问题。
而 script标签 img标签内的src 都不是xhr请求，就不会有跨域问题。
#### XHR(XMLHttpRequest)请求
什么是xhr请求，简单理解就是凡事通过ajax请求的，都是xhr请求， 比如ajax 或 fetch 或 axios请求；
与此相对的就是 script标签 img标签内的src 都不是xhr请求；
通过控制台，可以看请求是否为 xhr请求：
![](/image/proxy/xhr.png)

## jsonp
### 试一试
```
https://www.imooc.com/activity/newcomer

{"result":0,"data":{name:123},"msg":"\u6210\u529f"}

改成jsonp就是：
https://www.imooc.com/activity/newcomer?callback=ddd

返回为：
ddd({"result":0,"data":{name:123},"msg":"\u6210\u529f"}）
```
### JSONP的实现原理与工作机制

#### 概述

什么是JSONP —— 是一个非官方协议，约定发送请求的参数中如果包含指定的参数，默认为callback.即JSONP请求。

服务器发现是JSONP请求的时候，将返回值由原来的JSON对象改成js代码。

js代码的内容是函数调用的形式，它的函数名是callback的值，它的函数的参数是原先json对象。

#### jsonp要求服务端修改
要接口支持jsonp，需要服务端作出修改；
不过很多服务器默认自己修改了，不需要后端人员去修改， 服务器一旦识别到请求参数中有callback 关键字，就认为是jsonp，就以jsonp方式返回。
本节观点待进一步确认。

#### 服务器默认修改
参考《jsonp要求服务端修改》

#### callback关键字
参考上面
#### 服务端约定好后，callback关键字可以任意改
如题
### jquery ajax 的jsonp 原理
#### 概述
jquery的ajax方法支持jsonp，其jquery底层原理是 创建一个script标签，然后在url上加上callback关键字。
![](/image/proxy/cache.jpg)
#### ajax jsonp调用
```js
var result;
$.ajax({
  url:base+'/test',
  dataType:'jsonp',
  jsonp:'callback',//jsonp默认关键字是callback，也可以改为callback123任意名字
  success:function(json){
    result = json
  },
})
```
#### jsonp返回的是js代码
利用script的src发请求后，服务器默认服务器会返回js文件，因此如果服务端不作出修改，照样返回json数据，
就会让服务器处理数据报错，需要服务端作出修改。

而服务器通常是把data json当成 callback的入参，这样浏览器就能正常处理了
#### 需要服务端作出修改(服务端默认作出修改了)
参考上面《jsonp返回的是js代码》；
简单说，如果要接口支持jsonp，需要后台定义接口时，如果捕获到是jsonp请求，就返回js 字符串，这样浏览器就可以正确响应了。
至于服务器是否默认作出修改，待确认。

#### 用jq ajax 的jsonp请求与普通请求不同
- 请求type不同
  普通请求是xhr，jsonp 是script请求；
![](/image/proxy/jsonp.jpg)

- 返回的content-type不一样
普通请求是json或其他；jsonp 是 js。如上图

- url上会多callback
如上图，服务端返回时，是用callback入参名作为函数返回js，如下图：
![](/image/proxy/jsonp2.jpg)

#### 彩蛋：jq的jsonp避免缓存做法
用jq 的ajax jsonp，默认url还会有一个随机数，这是为了避免请求被缓存，可不用。
![](/image/proxy/cache.jpg)
可以设置需要缓存，如下，再次jsonp请求时，就不会有随机数了：
```js
var result;
$.ajax({
  url:base+'/test',
  dataType:'jsonp',
  cache:true,
  success:function(json){
    result = json
  },
})
```

### jsonp的弊端
- 服务器需要改动代码支持
- 只支持get请求，因为jsonp是通过script标签src，因此只能做get请求，对post等请求无能为力；
- 发送对不是XHR请求， XHR请求有很多有点，比如异步发送，各种事件，而jsonp不是xhr请求，因此不具备这些有点。










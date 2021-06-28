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

更多详细参考《jsonp》

#### 经典的跨域解决方式示意图
左侧是一个域名下的请求，右侧是另外一个域名下的客户端请求；
左侧客户端要请求右侧服务器，产生了跨域问题：
解决的方式有下面两种，不过都是基于中间层的处理，而不用动业务代码，保证了业务代码的纯粹性，从侧面说明了中间层的重要性。
![](/image/proxy/controler.jpg)


#### 跨域／普通 请求头区别
以下是8081域名下，请求8080域名下的test/get1接口，是一个跨域请求，
当浏览器发现是跨域请求时，会在请求头上标识一个origin，如下图，普通请求头是没有origin字段的：
![](/image/proxy/origin1.jpg)
![](/image/proxy/origin2.jpg)

如果浏览器识别出是跨域请求，当接口响应时，浏览器会去读取响应头信息，看有没有跨域信息，如果没有，就报跨域异常。
一般跨域信息有如下：
![](/image/proxy/origin.jpg)
如果有上面这些信息，就允许跨域正常响应客户端。

#### 示例
- 下面是正常的跨域请求，并且被浏览器正常响应：
![](/image/proxy/origin3.jpg)

- 下面是正常非跨域请求，以此与上面跨域请求做对比：
![](/image/proxy/origin4.jpg)

### 解读跨域异常信息
#### 概述
下面是一份常见跨域请求的异常提示，细细解读这个跨域提示也是很好玩的：
```js
Access to XMLHttpRequest at 'http://test.com/upload.json' from 
origin 'http://local123.com:8080' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```
- Access to XMLHttpRequest :侧面证明了跨域只针对 xhr(XMLHttpRequest)请求
- blocked by CORS policy : CORS是一个W3C标准,全称是"跨域资源共享"
- Response to preflight request doesn't pass access control check ： 预检请求(preflight request)得到的响应没有通过权限控制审核,是不是侧面证明了 跨域请求可能会发送两次，一次预检请求，一次正式请求，如下就是发送了两次：
关于请求发几次，会单独讲解
![](/image/proxy/origin5.jpg)
- No 'Access-Control-Allow-Origin' header is present on the requested resource. ： 请求的资源上(服务器上)没有设置'Access-Control-Allow-Origin'响应头， 侧面说明服务器上设置 'Access-Control-Allow-Origin'来解除跨域。

有上面解读知道跨域至少具备以下几个特征：

#### 只针对xhr(XMLHttpRequest)请求
如上。
#### 套路是Access-Control-Allow-Origin
如上。
#### 预检请求(preflight request)
跨域请求可能会发两次
可能会发一次预检请求，一次正式请求
![](/image/proxy/origin5.jpg)
#### 请求可能会发两次
如上。是否会发两次，下面单独说明。
#### CORS就是跨域的代名词
CORS是一个W3C标准,全称是"跨域资源共享"
### 黑知识
#### 浏览器是先判断还是先执行
对于跨域，你发的跨域请求，请求会正常到服务端，服务端也会正常响应，只是浏览器会判断请求是否跨域，如果是跨域，
浏览器就不会将服务端的响应数据给客户端，并报错提示跨域了。
因此浏览器是先执行，后判断。

#### 请求依然会正常到服务端，且服务端正常返回
跨域的请求依然会正常到服务端，且服务端正常返回，参考《浏览器是先判断还是先执行》
#### 既然是浏览器的限制，为什么设置服务器可以解决跨域
原来服务器可以设置响应头，告诉浏览器，我已经允许了这个域名跨域，请浏览器给予数据正常响应。
因此服务器可通过响应头与浏览器通话。
#### 原来服务器可通过响应头与浏览器这个壳对话
参考上面

#### 了不起的响应头
原来响应头不仅用于给软件返回数据，还可以用于跟浏览器通信，告诉或设置浏览器哪些可做，哪些不可做。
比如告诉浏览器跨域行为；
比如告诉浏览器我返回了什么类型的数据：json、js、text 等等，浏览器因此就根据相应类型解析。

#### 没有【客户端／服务器】，只有【客户端／浏览器／服务器】
我们说接口请求时，很多人只考虑客户端与服务器，其实不正确，
应该是客户端与浏览器与服务器三者之间关系。
浏览器是一层壳，把客户端隔开了服务器，
因此客户端与服务器的通信 受制于浏览器，
因此客户端发起一个接口请求，不仅要包含与服务器的通信数据，还要设置请求头信息与浏览器通信；
响应的，服务端响应一个接口请求时，不仅要包含响应数据，还要设置响应头告诉浏览器如何解析响应数据；

这也就说明了 设置请求头 与 响应头 的重要性了。

#### 请求会发几次
这点下面单独说明。

### 请求会发几次

#### 先执行 还是 先判断
跨域是先执行还是先判断？
先执行，说明跨域请求只做一次请求就完成。
先判断，说明跨域请求要在正式请求前，多发一次 预检请求，于是会发两次请求。
#### 简单请求 与 非简单请求
对于简单跨域请求，浏览器先执行，此时只发一次请求；
非简单请求，浏览器需要先预检判断，此时会发两次请求，一次预检、一次正式请求；

什么是简单请求：
方法为GET、HEAD、POST的请求，并且请求头（header）里面没有自定义头；
而且满足：
Content-Type：
text/plain、
multipart/form-data、
application/x-www-form-urlencoded。

什么是非简单请求：
除上之外，就是非简单请求：
比如：方法为PUT、DELETE的请求，发送JSON格式的ajax请求、带自定义请求头的ajax请求。

以上简单、非简单需求 是经验总结，不一定正确，只参考。

#### 预检请求及其缓存、性能优化
如果跨域请求每次都需要进行 跨域预检(preflight request)，发两次请求，未免性能影响，
为此可以在服务端针对此接口 设置 预检缓存，在一定时间内，不进行预检请求，一次请求即可完成跨域响应：
```js
res.addHeader("Access-Control-Max-Age", "3600")，表示隔60分钟才发起预检请求
```

#### 小结
简单跨域请求只发一次，非简单请求会发两次；
但非简单请求也不是一定要发两次，如果做了预检缓存，下一次发起跨域请求时，可能只需发送一次。
### 后端解决跨域的套路
#### 概述
后端解决跨域一般是设置 这两个响应头：
```js
//设置响应头，告诉浏览器，允许域名为http://localhost:8081的请求跨域
res.addHeader("Access-Control-Allow-Origin", "http://localhost:8081");
//设置响应头，告诉浏览器，允许get请求方式跨域
res.addHeader("Access-Control-Allow-Methods", "GET");
```
控制台显示如下：
![](/image/proxy/origin.jpg)

上面是针对一个域名下的请求，允许跨域，如果要针对所有域名，可设置为如下：
```js
res.addHeader("Access-Control-Allow-Origin", "*");
res.addHeader("Access-Control-Allow-Methods", "*");
```

#### 不过如此：Access-Control-Allow-Origin
这是响应头，告诉浏览器 允许跨域的域名。
更多参考上面
#### 不过如此：Access-Control-Allow-Methods
这是响应头，告诉浏览器 允许跨域的请求方式。
更多参考上面

### 带cookie的跨域
#### 概述
```
  $.ajax({
    type: "get",
    xhrFields: {
        widthCredentials: true // 告诉服务器，请求要读取后台设置的cookie
    }
})


4、跨域接口发送cookie时，后台代码注意以下2点：
（1）带cookie了的时候，Access-Control-Allow-Origin，必须是全匹配，如http://localhost:8081， 不能是 *
（2）enable cookie
res.addHeader("Access-Control-Allow-Credentials", "true")

为了能够匹配多个域，后端代码会写成这样：
String origin = req.getHeader("Origin");
if (!org.springframework.util.StringUtils.isEmpty(origin)) {
    res.addHeader("Access-Control-Allow-Origin", origin)
}
```

#### 注意点
这里说的带cookie跨域应该是，接口如何读取 服务端域名下的cookie；
而不是将客户端域名下的cookie发送给 跨域下的接口。
这里的cookie并不是接口发送域下的，因为浏览器默认发送的cookie都只能是本域名下的。

带cookie的跨域，有很多需要再研究，这里只是稍微笔记下。

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

#### ajax jsonp 原理分析
```js
//jquery 会在前端页面任意一个js上定义一个 全局的 callback getDataFn；
function getDataCallbackFn(res){
  console.log('这里是后端返回的jsonp数据：', res)
}

<script src="/https://www.imooc.com/activity/newcomer?callback=ddd"></script>

///https://www.imooc.com/activity/newcomer?callback=ddd 返回一个js文件，文件内容：

//返回为：
getDataCallbackFn({"result":0,"data":{name:123},"msg":"\u6210\u529f"}）
```

因此就相当于一个前端js 定义了一个 callback函数；
另外一个js 调用了 这个callback 函数；

很多人只熟悉这种script 引入js
```html
<script src="/abc.js"></script>
```
但却忽略了 `/abc.js` 也是一个 script请求；

用于jsonp的 `/https://www.imooc.com/activity/newcomer?callback=ddd` 同样也是一个 script请求；

因此这二者形成的js是一个道理，一样的没有任何区别

#### src="/abc.js" 与 src="/callback=ddd" 都是js文件

如上《ajax jsonp 原理分析》

#### 貌似奇怪的js文件引入方式 src="/callback=ddd"
刚开始都以为 src="/callback=ddd" 这种方式引入的js特殊，其实没有任何特殊的，它跟"/abc.js" 方式都是js文件的请求；
没有任何区别。
如上《ajax jsonp 原理分析》
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


## http
一些http的知识，暂时统计在这里
#### Access-Control-Allow-Headers
说明请求需要询问服务器后台是否允许这个content-type头;
![](/image/proxy/http.jpg)








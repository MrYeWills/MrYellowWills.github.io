---
title: 再读http协议
date: 2021/3/24
tags: [前端, http协议]
categories: 
- 前端
---

## html协议基础
### 了解http协议

#### 概述

http协议是构建在TCP/IP协议基础上的，是TCP/IP协议的一个子集；

TCP/IP协议是有四层协议组成度系统：
应用层，传输层、网络层、数据链路层
![](/image/http_again/http1.jpg)

传输层 有两个性质不同的协议：
tcp 是有连接的(三次握手)，安全、不过效率低点；
UDP 无连接，不安全，不过效率更快；

下面是数据包封装过程：
![](/image/http_again/data.jpg)
![](/image/http_again/datah.jpg)
![](/image/http_again/ceng1.jpg)
![](/image/http_again/ceng3.png)
![](/image/http_again/ceng2.png)
![](/image/http_again/ceng4.png)
![](/image/http_again/ceng5.png)


![](/image/http_again/back.jpg)

http连接何时结束：
![](/image/http_again/leave.jpg)

#### 无连接(请求完即关闭) 与 面向连接(三次握手)
如题。http拥有此特性。



 #### 无状态
对于服务器而言，无论第一次还是第几次请求 都一样，服务器返回的东西是一样的，服务器不会记住之前的请求情况，
这就是http请求的无状态性
 #### 两种保持连接状态的手段：cookie与session
参考《session》
 ### session

 #### session 一般于 cookie一起使用
显然无状态性质难以满足某些需求，因此产生了两种保持状态的手段cookie与session；
前者存储于客户端，后者存储于服务端；
比如你之前做过 登录的http请求，你就有cookie， 第二次请求服务器的时候，虽然请求还是无状态的，
但是通过cookie这种技术手段，可以保存之前的请求信息，为下次服务器响应提供信息。

也称为会话跟踪技术。

session 基本上要与 cookie 一起使用；
如下图，通过session信息 设置cookie，通过cookie，每次更新session信息，进而更新cookie。
![](/image/http_again/cookie.jpg)
![](/image/http_again/cookie1.jpg)
![](/image/http_again/cookie2.jpg)

#### session与cookie 区别和异同
前者用户服务端，后者客户端；
前者有时效性，可能很短； 后者cookie，可以设置无限长时间；

#### session 也可于 url 一起使用
百分之九十的网站使用cookie 配合 session使用；
也有浏览器禁用了cookie，是不是就不能使用session了呢；
此时可以使用url 配合 session使用；
session本质上是服务端给客户端存储的用户档案；
只要有技术能将客户访问信息传给服务端那么 session就可以发挥档案存储作用；
除了cookie，客户端可通过url把用户信息(session)传给服务端：
一种是给url 添加附加信息(分号隔开)传给服务端：
![](/image/http_again/url.jpg)
一种是给url，添加查询信息：
![](/image/http_again/url1.jpg)

### http的长短连接 本质是TCP长短连接
#### 概述
http协议是应用层的协议，而连接是传输的意思；
因此http的长短连接，本质上是传输层的TCP协议；

#### http1.1默认长连接
http1.0默认用短连接；
http1.1默认用长连接；

#### 长连接需要服务端和客户端都支持
如题。

#### 适用场景
长连接适合 要频繁请求的；
短连接适合 不常请求；

#### 长连接要考虑的
服务端应该要考虑 哪些连接如果长时间处于空闲，就应该关闭连接；
或者当一台电脑于服务器长连接超过一定数量时，关闭一些长连接；

### 代理 与 抓包
如下为什么很多抓包工具都使用了代理呢，
因为抓包工具都需要抓取请求的入参和返回，只有通过一层抓包工具的代理，所有的请求都发往抓包代理服务器，
进行转发，如此，抓包工具就可以抓取 入参和响应，市面上场景抓包工具都有用代理，可以这样验证：
打开一个抓包工具，然后点击浏览器的代理设置，此时应该浏览器走了代理了
![](/image/http_again/proxy1.jpg)
![](/image/http_again/proxy.jpg)
### 网关
网关跟代理相似，不同的是，代理只能转发协议相同的请求；
网关则没有这个限制；
网关是一个协议转换器。
![](/image/http_again/gateway.jpg)
![](/image/http_again/gateway1.jpg)
![](/image/http_again/gateway2.jpg)
![](/image/http_again/gateway3.jpg)

### 缓存
#### 一般对静态资源缓存
一般页面对请求频率不大的做缓存，比如静态资源，如js、css、图片等；

#### 缓存一般通过请求头与响应头实现
![](/image/http_again/cache.jpg)
![](/image/http_again/cache1.jpg)
Expires 与 Cache-ConTrol 的 max-age共存时，优先级比 max-age地；
![](/image/http_again/cache2.jpg)
![](/image/http_again/cache3.jpg)
Etag优先级比 Last-Modified 高；


#### 请求场景demo
![](/image/http_again/cache4.jpg)

如果过了Expires时间，但是文件又没有修改呢，此时引入 Last-Modified，如果Expires过期，但Last-Modified没有变化，那么认为文件是同一个，返回304； 
Last-Modified优先级比Expires高。
![](/image/http_again/cache5.jpg)
![](/image/http_again/cache5-1.jpg)

Last-Modified是一个秒或者毫秒单位，也有可能在同一秒甚至毫秒内，文件也被改变的情况，此时引入 Etag 作为文件的唯一标识，
如果 Etag 改变，其他缓存头都无效，Etag优先级最高。
如果Etag未改变，则直接认为 304；
![](/image/http_again/cache6.jpg)
![](/image/http_again/cache6-1.jpg)

### cdn
#### 概述
一个城市只有火车站才能售票，
此时城东、城西、城北、城南 的人都只能去火车站买票，
一来加大了买票人购票效率，让购票更加麻烦；
二来加大了火车站承受压力，全城的人都去火车站买票，火车站就这么大，无法扩建，这样火车站就承受了很大的售票压力。
此时火车站在城市各地设置了 火车票代售点，既方便了购票人，也减轻了火车站总站的压力；
而cdn就类似这样的火车票代售点。
![](/image/http_again/cdn.jpg)
#### 优点
- 提高了访问速度；
一个是就近提高了访问速度；
另外一方面，比如北方大多人用联调，南方大多用电信，此时北方人通过联调cdn服务器肯定要比电信cdn服务器快。
- 减轻了对服务端总站访问的压力；

#### 工作机制
![](/image/http_again/cdn4.jpg)
![](/image/http_again/cdn3.jpg)

### 内容协商机制：不同地区访问，返回不同语言页

#### 概述
![](/image/http_again/accept1.jpg)
同一个url，不同地区访问时，可能出现不同语言的页面，
这与服务端与客户端内容协商返回机制有关，
目前主流的内容协商机制是 服务端判断请求头信息，进行内容返回，
如下是主要的内容协商 的请求头：

![](/image/http_again/accept.jpg)

#### 近似匹配 q
下图 q用来表示优先级权重，用于近似匹配：
![](/image/http_again/accept2.jpg)

### 断点续传和多线程下载
#### Range
断点续传的请求，请求头会包含 Range 请求头：
![](/image/http_again/range0.jpg)
迅雷的下载暂停与继续下载，或者 下载过程 网络异常或中断，网络连接后 继续下载，这些都是断点续传。

![](/image/http_again/range.jpg)
![](/image/http_again/range1-1.jpg)

#### 206
断点续传成功后返回的状态码是 206 而不是 200。
![](/image/http_again/range1.jpg)

#### 断点续传过程
![](/image/http_again/range2.jpg)

#### 多线程下载(分片下载)
多线程下载与断点续传一样，只是断点续传是被动，一个片段一个片段下载；
多线程下载是主动将下载切割成多个片段，同时进行下载。

### 请求头
#### 概述
![](/image/http_again/http1.jpg)
![](/image/http_again/http2.jpg)
![](/image/http_again/http3.jpg)
![](/image/http_again/http4.jpg)

#### accept

406 响应码：
![](/image/http_again/httpattr1.jpg)

#### 其他
![](/image/http_again/httpattr2.jpg)
![](/image/http_again/httpattr3.jpg)
![](/image/http_again/httpattr4.jpg)
![](/image/http_again/httpattr5.jpg)
![](/image/http_again/httpattr6-1.jpg)
![](/image/http_again/httpattr6-2.jpg)
![](/image/http_again/httpattr7.jpg)


![](/image/http_again/code1.jpg)
![](/image/http_again/code2.jpg)
![](/image/http_again/code3.jpg)
![](/image/http_again/code4.jpg)
![](/image/http_again/code5.jpg)


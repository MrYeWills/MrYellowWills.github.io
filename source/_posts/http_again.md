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

#### 无连接(请求完即关闭) 与 面向连接(三次握手)
如题。http拥有此特性。

 #### 无状态
对于服务器而言，无论第一次还是第几次请求 都一样，服务器返回的东西是一样的，服务器不会记住之前的请求情况，
这就是http请求的无状态性
 #### 两种保持连接状态的手段：cookie与session
显然无状态性质难以满足某些需求，因此产生了两种保持状态的手段cookie与session；
比如你之前做过 登录的http请求，你就有cookie， 第二次请求服务器的时候，虽然请求还是无状态的，
但是通过cookie这种技术手段，可以保存之前的请求信息，为下次服务器响应提供信息。

也称为会话跟踪技术。

session 基本上要与 cookie 一起使用；
如下图，通过session信息 设置cookie，通过cookie，每次更新session信息，进而更新cookie。
![](/image/http_again/cookie.jpg)
![](/image/http_again/cookie1.jpg)
![](/image/http_again/cookie2.jpg)

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


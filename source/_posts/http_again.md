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
 #### 概述
 如下用户登录，后台生成session，然后将session写入cookie，页面的后续操作都通过cookie读取，对比session。
 ![](/image/http_again/sess.png)

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

### http协议瓶颈
#### 概述
一个浏览器同一个域名下，一次最多4个http连接请求，后面的将阻塞；根据各个浏览器不同，连接数量不一样。
![](/image/http_again/low.jpg)

#### websocket
![](/image/http_again/ws.jpg)
websocket的优点：
- 全双工连接；
- 减少通信量，如建立ws连接后，后续通讯不用请求头信息等等。

### spdy
![](/image/http_again/spdy.jpg)
![](/image/http_again/spdy1.jpg)
![](/image/http_again/spdy2.jpg)
![](/image/http_again/spdy3.jpg)
## http协议进阶

### 多种加密方式(https)
#### 对称加密
对称加密也叫密钥加密，加密和解密都使用一个密钥。
如下图，会话开始，小萌 把密钥 key1 发给 小风；
后面小风每次与小萌通过都通过这个密钥 key1 加密。
![](/image/http_again/https1.jpg)

这样有个问题，如下图，中间人在一开始就截取了他们的请求，一开始就获取了 小萌发的key1密钥，那么中间人就可以解密二者的谈话内容了。
![](/image/http_again/https1-1.jpg)
#### 非对称加密
为了解决上面的问题，就要用到非对称加密，**非对称加密有个重要特点，有公钥和私钥，可以通过公钥加密，私钥解密；也可以通过私钥加密，公钥解密**。
如下图，小萌把自己的公钥 key1 发给 小风，小风自己设置好一个密钥key2，同时用key1加密key2得到va3，发给小萌；
![](/image/http_again/https2.jpg)
小萌收到va3后通过自己的私钥解密va3，也得到了key2。
此时小风和小萌都知道了密钥key2。
他们之间可以像上面对称加密一样，通过key2进行加密对话。
而中间人由于没有小萌的私钥，因此无法解密va3，无法获取key2，就无法解密他们的通话。
上面通过非对称加密 来传输 对称加密的密钥，保证对称加密的密钥不被盗取；
后期通过对称加密经过通话。
![](/image/http_again/https3.jpg)

不过这样有个问题，由上面知道，只要能获取小风的对称加密密钥key2，就能解密对话，因此中间人在他们第一次会话时，串改 小萌的key1，换一个自己的公钥kex1给小风；
小风通过kex1加密key2得到va3； 中间人通过私钥解密va3，获取key2，再用key1加密key2获得va3-1 给 小萌，
小萌通过私钥解密va3-1获得key2.
这样 三个人都获得了 小风的密钥key2.
![](/image/http_again/https4.jpg)
![](/image/http_again/https5.jpg)
#### 证书加密(https)
为了解决上面问题，此时引入了证书，如下图，小萌将key1发给证书机构，证书机构发给小萌一本证书。

小萌将证书发给小风，因为各大浏览器都知道所有机构的证书消息，小风核对证书真假后，因为浏览器知道各个证书的key1，小风获得key1；
小风通过 key1 加密 key2，传给 小萌， 小萌私钥解密获得key2，后期就通过key2 进行通话。

因为证书的生成包含了服务器地址 等一系列信息，基本上无法造假，所有中间人无法伪造证书，解决了上面串改的问题。

![](/image/http_again/https6.jpg)
![](/image/http_again/https7.jpg)
![](/image/http_again/https8.jpg)

因为证书带了一系列服务器地址信息，所有无法针对指定的服务器再伪造一个证书；
而浏览器又有鉴别证书是否为某个服务器的能力；
因此中间人无法再通过自己伪造证书从浏览器端骗来 浏览器用于对称加密的密钥了。

### https
#### 概述
在国内https起源于2014年百度网站的率先使用，到如今不过6年多。
![](/image/http_again/httpsm1.jpg)
![](/image/http_again/httpsm2.jpg)

#### 特点
- 内容加密：保证浏览器发送到客户端的报文是加密的；
这个过程中，**非对称密钥交换，对称内容加密**：非对称加密用于密钥交换，对称加密用于内容加密，详细参考《多种加密方式(https)》

- 身份认证：保证你当我的服务器准确性

- 数据完整性

#### 使用成本
- 证书费用以及更新维护：其实这个也不算贵；
- https降低用户访问速度：其实合理部署，不逊于http速度
![](/image/http_again/httpsm3.jpg)
![](/image/http_again/httpsm4.jpg)
- 消耗cpu资源，需要增加大量机器：比如非对称密钥交换，对称内容加密，这些都消耗cpu等等

#### https加密的误解
https加密是报文加密，防止的是中间代理窃取报文，防止抓包 等等；
因此https加密是相对中间代理、抓包工具而言的加密，如果你用抓包工具抓包 https请求，你会发现报文都是加密的；
但https加密不对浏览器控制台加密，用浏览器查看请求参数，都是未加密的。

### http2.0
2015年出现；
http2.0 与 spdy渊源很深，很多原来维护spdy的人，后面转而去维护http2.0，某种意义说，http2.0是spdy的升级。
![](/image/http_again/http20.jpg)

### http 0.9与1.1区别
这里只讲述部分区别。
####  http 1.1 并发6个tcp连接
http 1.1 可以并发建立tcp连接，从而并发http请求，
因浏览器不同，并发连接数量略为不一，一般认为是6个tcp连接。
不过每个tcp连接只能一个一个地进行http请求，无法并发http请求。
由于一次可同时并发6个tcp连接，每个tcp同时只能处理一个http请求，
因此可说 http1.1协议可同时并发 6个http请求。

#### keep-alive 长连接
1.1默认长连接，tcp连接后，一次http请求完后，不会关闭tcp连接，后期其他操作的http请求 可复用tcp通道进行传输。
这从侧面说明了，tcp是类似 火车的铁路道路，是传输的道路，http数据包请求是道路上奔跑的火车，关闭铁路，火车就不能传输。

#### 一个tcp连接同时只处理一个http请求
参数上面。

#### 实验-通过浏览器查看(需要设置3G网络)
如下，需要设置 网络为3G，不然看的不是很明显，且设置清除缓存：
![](/image/http_again/compare1.jpg)

如果网络速度很快，导致http响应非常快，此时都来不及或者没必要建立新的tcp连接，直接复用上一次tcp连接，此时看到的tcp连接不是很明显的6个：
![](/image/http_again/compare2.jpg)


### http 1.1与2.0区别
这里只讲述部分区别。
#### 一次tcp连接，并发多个http请求
1.1的一个tcp连接只能一个接着一个地处理http请求，
2.0可以让一个tcp连接同时并发多个http请求，目前也没说明有多少数量限制；
#### 不同域名使用不同tcp连接
值得注意的是，如果页面请求的域名只有一个，那么一个页面渲染就只有一个tcp连接。
不过如果页面内的请求，有多个域的时候，就会并行建立多个tcp连接。
#### 双工通信，服务端主动推送
最典型，比如一个html的请求，服务端会主动解析html内容，返回html的同时，将css js 等静态文件一并返回。

#### http请求的优先级
比如用于渲染页面的css请求会优先图片的请求发送，服务端也会优先响应css等这些高优先级请求。以让页面更早呈现，不过这些优先级也不是绝对的。

#### 实验-通过浏览器查看
设置清除缓存：
![](/image/http_again/compare3.jpg)


### 意想不到的 (http连接 tcp连接 与 长短连接)
http连接其实不准确，只有http请求，没有http连接，
连接本质是tcp连接。
因此长短连接，都是tcp连接而言的，
没有所谓的长短http连接。
http请求 得到响应后，这次http请求就完成和关闭。

---
title: 再读http协议
date: 2021/3/24
tags: [前端, http协议]
categories: 
- 前端
---

## html协议基础
### 了解http协议

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

 


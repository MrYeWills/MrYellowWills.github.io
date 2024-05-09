---
title: 浏览器系列(一)：浏览器基础知识
date: 2022/8/28
tags: [浏览器, 浏览器插件]
categories: 
- 浏览器

---

## 浏览器原理

### 谷歌的多进程
当前谷歌是多进程，启动谷歌浏览器后，就会启动浏览器主进程、插件进程、渲染进程， 其中每个标签页面会单独对应一个渲染进程，多个页面就会有多个渲染进程。
我们的html、js、v8引擎都在这个渲染进程中，这个渲染进程处于一个沙箱内，这样目的是为了不影响其他页面，保证了稳定性。
{% img url_for /image/ntool/b0.jpg %}

随着3d动画的出现，后面又出现了 一些其他基础服务进程，比如 GPU进程、网络进程 等等。
{% img url_for /image/ntool/b1.jpg %}

开启的进程越多，越会消耗cpu 内存，谷歌会智能监测电脑的内存，如果发现内存不足，谷歌会智能的将 上述基础服务合并到浏览器主进程内。

{% img url_for /image/ntool/b2.jpg %}

[第三节浏览器工作原理：chrome架构演进](https://www.bilibili.com/video/BV18q4y1L7Wh?p=11)



### 浏览器的工作流程
#### 工作过程说明
{% img url_for /image/ntool/b.jpg %}
{% img url_for /image/ntool/b3.jpg %}
图示
{% img url_for /image/ntool/b4.jpg %}

#### 一个http请求过程：
{% img url_for /image/ntool/b5.jpg %}

#### 完整流程
{% img url_for /image/ntool/b6.jpg %}

### 进程职责
浏览器进程职责
主要负责界面显示、用户交互、子进程管理和文件储存等功能。

网络进程职责
网络进程是面向渲染进程和浏览器进程等提供网络下载功能。

渲染进程的主要职责是把从网络下载的html、js、css、图片等资源解析为可以显示和交互的页面。


### 进程通讯
进程之间是相互隔离的，类似沙箱，之间的通讯是通过 IPC 来完成。
进程隔离是保护操作系统中进程互不干扰的技术。

内核开辟一个缓冲区，存入要通讯的数据，以便其他进程共享缓冲区数据，这种技术 就是进程通讯IPC。

### 地址栏输入一个url
我们在地址栏输入一个url，
浏览器进程就把这个url 发送至 网络进程；
网络进程接收到url后，会在这里真正发起请求：dns解析获取ip，通过ip，与服务器建立tcp连接，


导航 用户发起url请求到页面开始解析到过程叫做导航。

当浏览器进程接收到网络进程的响应头数据之后，便向渲染进程发起 提交文档 的消息。

渲染进程接收到 提交文档 到消息后，会和网络进程建立传输数据的 管道，这个管道其实就是上面说的 IPC。

等文档数据传输完成之后，渲染进程会返回 确认提交 的消息给浏览器进程。

浏览器进程在收到 确认提交 的消息后，会更新浏览器界面状态，包括了安全状态、地址栏的url、前进后退的历史状态，并更新web页面。

在这之后，就进入了渲染阶段。



### 为什么要将html解析成dom，
因为html无法被渲染引擎直接识别的，
需要将html转为渲染引擎能识别的内部结构，这个结构就是 dom。
{% img url_for /image/ntool/b7.jpg %}

### dom树如何生成：
在渲染引擎内部，又一个html解析器 htmlParser 的模块，它的职责就是负责将html字节流转换为dom结构。

### dom树的生成过程
网络进程通过IPC将文档字节流传输给 渲染进程 解析。
注意的是，渲染进程不会等 html字节流完全传递完才解析，而是一边接收一边解析。
{% img url_for /image/ntool/b8.jpg %}

解析器将字节流解析成tokens，放入tokens栈中，然后解析成dom树
{% img url_for /image/ntool/b9.jpg %}

tokens栈 类似js执行上下文的压栈出栈过程。html解析器，遇到开始的标签，就放入tokens栈中，遇到结束的标签，就把这个tokens从栈中删除，直到tokens栈为空。
{% img url_for /image/ntool/b10.jpg %}
{% img url_for /image/ntool/b11.jpg %}


### 计算css与排版
dom树生成后，就要根据dom树生成布局树，
{% img url_for /image/ntool/b12.jpg %}
如图所示，左侧阶段A，中间阶段B，右侧阶段C，
A是生成dom树，
B是计算css，
C是生成布局树；

如果是重排，那么上述三个阶段都要走一遍；
如果是重绘，那么只需走上述的B、C阶段，相比重排，少了生成dom树的步骤，节省性能。

计算css与document.styleSheets
渲染引擎会将css内容变成 document.styleSheets ,可以控制台打印看看，然后再进行css的计算。

### 根据布局树生成图层树
{% img url_for /image/ntool/b14.jpg %}

#### 生成图层的几种特性
以下条件下会生成图层
{% img url_for /image/ntool/b15.jpg %}
{% img url_for /image/ntool/b16.jpg %}

### 分层与合并
如果将所有的内容放入一个图层中，那么不可避免就容易重排，为了性能，
浏览器渲染，引入了 图层分层的功能，跟ps软件的图层是一样的概念，
将内容分成多个层，多个图层的渲染互不干扰，比如将loading动画单独为一个图层，那么只需loading图层重排渲染，而其他图层不渲染，提高性能。

多个图层 合并一起，成为最终显示图像，叫做合并。

#### 在控制台看图层。
{% img url_for /image/ntool/b13.jpg %}

### 更多细节
生成图层绘制列表，然后对图层珊格化形成图块，按照靠近视口的优先级最高最先渲染原则。
渲染的过程要将内容写入内存，再将内存显示在屏幕中，如果内容较大，电脑读写速度慢，那么这个过程就比较卡顿。
谷歌浏览器为了优化这个，会将内容先以低分辨率写入内存，然后再以真实分辨率显示。
{% img url_for /image/ntool/c1.jpg %}
珊格化
{% img url_for /image/ntool/c2.jpg %}
{% img url_for /image/ntool/c3.jpg %}
{% img url_for /image/ntool/c4.jpg %}

### 如何生成1帧的图像，
浏览器生成一帧的图像要 经历 生产dom树、布局树、图层树，最终交由渲染引擎绘制生成图像。
这个过程按照 一秒60帧的体验看，要求我们1000/60=16ms 内，生成一帧图片，才不会卡顿。
而上述过程中，要经历 js执行，到最终生成图像，如果写的js或css不好，生成一帧图像 可能大于16ms，就显得卡顿。


### 参考

[第三节浏览器工作原理：chrome架构演进](https://www.bilibili.com/video/BV18q4y1L7Wh?p=11)


## 浏览器知识
### 浏览器内核
浏览器内核指的是浏览器的排版引擎，也称为浏览器引擎、页面渲染引擎、样版引擎。
比如 谷歌之前内核为 webkit，现在为blink。

### v8引擎的原理
{% img url_for /image/ntool/b17.jpg %}
{% img url_for /image/ntool/b18.jpg %}


## 浏览器插件

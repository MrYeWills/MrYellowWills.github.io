---
title: verdaccio(三)：要点与学习
date: 2022/7/20
tags: verdaccio
categories: 
- 前端工具
series: verdaccio
---


## 如何学习verdaccio
如果学习的话，
首先快速略读一遍官网，
可以先跑下verdaccio的demo；
然后往上找一些视频、文档教程看看，
然后再较为仔细读一遍官网，
然后将verdaccio的github clone下来运行起来，主要是主题插件的运行。
如果有时间，可以学一下docker nginx 知识，了解下redis，
然后试着写一些插件；
上述的四大块，verdaccio内部其实也是通过插件实现的，
如果不知道如何写插件，直接把verdaccio的github官网git clone 下来，
然后安装依赖，将项目起气来，
其中的主题插件是能启动的，这点还是蛮有意思。
另外要将verdaccio玩起来，
最好结合docker、nginx，
或者再加上redis。


## verdaccio知识框架要点
verdaccio主要学习
verdaccio的主要功能，
其实功能点不多，
无非就是 包的publish、下载的配置；
publish权限的配置；
publish成功后的通知处理；
ui主题配置 ；
然后就是四大块插件的开发:
认证 用于publish权限等控制
存储 用于缓存处理，可以存本地，可以存云盘
主题 使用官网ui主题源码改改
中间件 这里可以写一些接口等等，能做的事情很多；

以上这些官网都有讲，可以多读读官网。


## verdaccio的官网
官网的内容不多，可以全量多读几次。
除了文档本身，还要关注官网给的示例，
然后要结合verdaccio自己的github中内置的插件源码。
这里提一笔，就是ui主题要修改的话，直接将内置的ui主题下载下来改改即可。
很多verdaccio的插件其实就是抄抄现在的社区例子或verdaccio内置的源码插件




## 如何学习写插件
官网在各个插件开发篇的结尾有社区贡献的插件，
可以直接将这些插件git clone 下来，看看其思路改改；
比如存储插件，示例中就提供了如何将存储放在云盘以及本地的两种方案示例；







## 如何调试学习verdaccio

### 调试/开发 @verdaccio/ui-theme
要注意的是 verdaccio 版本的不同，对应的 @verdaccio/ui-theme 版本也是不同的。

如何判断 verdaccio 对应的 theme 版本，可以npm i verdaccio@version ，然后查找 package.json 对应的 theme 版本号。

verdaccio 5.x 版本对应 @verdaccio/ui-theme 3.4.x 版本， 此时的 @verdaccio/ui-theme 包 是独立的库。

verdaccio 6.x 开始，所有的相关的插件都放在了一个github目录。

无论是 5.x 6.x @verdaccio/ui-theme 都可以down下来，然后本地启动起来。

为什么要不同的版本对应不同的ui-theme，因为里面有一些接口有变化，
目前注意到 @verdaccio/ui-theme 请求的接口，有些接口是在 `verdaccio/build/api/web/endpoint/package.js` 中定义。

注意的是 @verdaccio/ui-theme 3.4.x 的yarn install 安装要求 yarn 2.x，且安装时间差不多有20分钟。
如果机器快，可能七八分钟。
































---
title: node模块
date: 2019/8/13
tags: [node , nodemon]
categories: 
- [后端]
series: node
---

## node好用模块

### nodemon
一款用于 使用node启动的项目，监听当项目文件变动时，自动启动类似npm start命令的模块。
[demo示例](https://github.com/YeWills/koa-demo/tree/master)

#### Usage
使用非常简单

```
//package.json
{
  "name": "koa-book-pro",
  "version": "1.0.0",
  "description": "",
  "main": "server/index.js",
  "scripts": {
    "start": "nodemon ./start.js"
  },
  "author": "YeWills",
  "license": "MIT",
  "dependencies": {
    "koa": "^2.4.1",
    "koa-bodyparser": "^4.2.1",
    "koa-router": "^7.4.0",
    "koa-static": "^5.0.0",
    "koa2-cors": "^2.0.6",
    "nodemon": "^1.18.10"
  },
  "devDependencies": {}
}

```
package.json 同级目录下 配置 nodemon.json
```
//nodemon.json
{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/**/node_modules",
    "README.md"
  ],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "watch": [
    "server/",
    "src/"
  ],
  "ext": "js json"
}
```
然后用npm start 启动项目，files改变时，会自动npm start，非常好用。
[关于上面代码的解释](http://www.cnblogs.com/JuFoFu/p/5140302.html)
或自行查询GitHub官网

#### 使用注意
以上代码注意的是:
nodemon.json 中 js属性配置了 node --harmony 命令
```
 "execMap": {
    "js": "node --harmony"
  },
```
那么请在 package.json中 start中，把node关键字去掉
```
//正确配置
 "scripts": {
    "start": "nodemon ./start.js"
  },
```
```
//错误配置 ，配置了多余的node
 "scripts": {
    "start": "nodemon node ./start.js"
  },
```

#### 视频参考
[nodemon介绍](https://www.imooc.com/video/20683)

### parcel

#### 概述
parcel 一款非常好用的工具，你只是想写一个小页面，页面只有一个单纯的html，但你又想使用less写css；
有一天，你又想写一个小页面，需要用到一些交互，想使用react框架，当又不想配置webpack，又想用到less；
此时，parcel就是你的不二选择。
parcel最大的亮点之一就是 简单和自带热重载特性 ，就凭这两个，你值得拥有。

#### 想使用less又不想配置webpack
参考上面
#### 无需webpack让你使用react、vue
参考上面
#### 简单简单简单
重要的事情说三遍，parcel非常简单，非常适合小型项目，或者小型demo，或者自己的小demo
参考上面
#### 热重载
#### build功能
parcel又build功能，build后生成的文件，可用于生产。

#### demo／参考
[官方demo](https://createapp.dev/parcel)
[demo](https://github.com/YeWills/parcel-demo)
[github](https://github.com/parcel-bundler/parcel)





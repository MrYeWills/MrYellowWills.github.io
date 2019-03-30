---
title: node好用模块笔记
date: {{ date }}
tags: [node node_modules]
categories: 
- [node, nodemon]
series: 服务端
---

## node好用模块

### nodemon
一款用于 使用node启动的项目，监听当项目文件变动时，自动启动类似npm start命令的模块。

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


---
title: node模块
date: 2019/8/13
tags: [node , nodemon]
categories: 
- 前端工程
---

## node好用模块

### semver
很好用的，用于测试 npm 版本是否匹配
https://github.com/npm/node-semver
```js
const semver = require('semver')

semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean('  =v1.2.3   ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
```

### nodemon
一款用于 使用node启动的项目，监听当项目文件变动时，自动启动类似npm start命令的模块。
[demo示例](https://github.com/YeWills/koa-demo/tree/master)

#### Usage
使用非常简单

```json
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
```json
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


### npm view

- `>` 是linux 的 重定向输出 符号，这里将命令行的输出 放到文件 log.txt 显示
- 关于重定向 可查看 《Linux笔记(乾) 中 输出重定向》
- --json 是 [npm view 的配置](https://docs.npmjs.com/cli/v7/commands/npm-view)，加上 --json 让输出的内容不会乱码
```sh
 npm view react --json > log.txt
  #查看 log.txt，发现 其内容是一个非常丰富的对象， 可以显示对象的属性内容

  npm view react time  #可显示react 所有版本 及其 发布时间
  npm view react repository #显示npm地址
  npm view react #可显示react当前稳定版本，及其其他简略信息
```

#### 可以查看哪些字段
要看npm view 可以查看哪些 属性字段，可以使用 --json ，
这样打印出来的 json，里面所有的key，就是可以查看的属性字段，
其中可以看到里面的 time 就是所有的版本号和时间。
还有很多其他字段，可以自己尝试看看，
```sh
npm view redux --json > data.txt
npm view yui3@'>0.5.4' --json > data.txt
```

### concurrently
npm script 中同时运行多个命令，遇到复杂情况，可能命令行提示不够，后面一个命令的提示覆盖了前一个，此时可以使用 concurrently。

Run multiple commands concurrently. Like npm run watch-js & npm run watch-less but better.
In package.json, escape quotes:
```js
// \" 是转义的意思
"start": "concurrently \"command1 arg\" \"command2 arg\""
```

### qs.stringify
```js
const qs = require('qs');
axios.post('/foo', qs.stringify({ 'bar': 123 }));
```
[参考](https://www.jianshu.com/p/798c8cb45ed5)
[参考](https://blog.csdn.net/q290057637/article/details/104544757)


### npm trends

比较 npm 包下载量 https://www.npmtrends.com/
### glob

#### 获取目录下所有的index.js 路径
{% img url_for /image/node_module/glob.png %}

#### **/ 的妙用
见上面
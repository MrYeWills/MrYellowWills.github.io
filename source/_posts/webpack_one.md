---
title: webpack升级之旅(往)
date: 2022/3/23
tags: webpack
categories: 
- 前端工具
series: 前端
---

*往蹇来誉 田获三狐*

懂webpack配置不难，但webpack升级后，旧的经验很容易出问题，且webpack像一个黑箱，难以解决。
webpack配置学习三个月，升级之后又三个月，没完没了，没有镜头。
为此决定一改以往学习webpack配置的策略，
改为直接学习webpack调试经验以及了解其源码和原理，
以便出现问题或需求，可以直抵关键，一击必中。

## demo

### 官方 webpack github demo
可以使用此 [demo 分支 version-debug-5.69.1 ](https://github.com/YeWills/webpack/tree/version-debug-5.69.1) 进行webpack源码调试，此demo是fork webpack官方github的。
里面有 [webpack5 的视频](https://www.bilibili.com/video/av462922583?from=search&seid=14121423744670771391&spm_id_from=333.337.0.0)调试经验分享。

目前用 /d/workplace/qiqiaonpm/webpack-4.6 demo 来测试一些问题，比如 babelrc nodem module 不编译的问题； html 编译出问题 md5 编译出问题；

后期基于 之前写的webpack-demo 新创建一个 webpack 调试demo；也可以直接基于 官网的 github demo 调试；
留一个公司的webpack-demo以做区别；



<!-- 测试以 D:\workplace\xxxxnpm\webpack-4.6 -->
<!-- webpack 有一个源码启动的 D:\git\webpack-->


## webpack源码调试

### 概述

webpack 命令
bin/webpack.cmd
webpack.js

### 教程
https://www.bilibili.com/video/BV12L411t7Pr?spm_id_from=333.999.0.0

compiler 与 compilation 区别和联系
手写简易版本的打包器 (ast 抽象语法树， dom树)
loader(ast)
plugin

#### webpack入口

- 执行npm run build  最终找到 bin/webpack.js
上述的文件里其实就是判断 webpack-cli 是否安装，如果安装了则执行 runCli 方法
在 runCli 方法里加载了 webpack-cli/bin/cli.js
在cli.js 当中核心就是判断 webpack 是否安装了，如果安装了 则执行 runCli
在runCli 里处理命令行参数 （依赖了commander），执行 new WebpackCli 的时候会去触发 action 回调；
this.program.action() ，而这个this.program = program(commander)
action的回调当中执行了 loadCommandByName-》makeCommand->runWebpack
runWebpack()的时候执行了 createCompiler()
在createCompiler 内部调用了 webpack 方法， 接收配置文件和回调，最终生成了一个compiler对象，而这个compiler对象会在上述的调用过程中被返回，它就是我们webpack 打包的第一个核心的有关“人员”
上面的 webpack 就是我们本地安装好的 webpack
如果想让webpack 打包，其实就是使用 webpack 函数来接收 config，然后调用 run 方法即可。
```js
const webpack = require('webpack');
const config = require('./webpack.config')

const compiler = webpack(config)


compiler.run((err, stats)=>{
    console.log(11)
})
```



















---
title: react_redux_demo项目笔记
date: {{ date }}
tags: [react, redux-thunk]
categories: 
- 前端工程
series: 前端工程
---

本篇博客针对 github 的[react_redux_demo项目](https://github.com/YeWills/react-redux-demo)一些知识点讲解。

## redux-thunk
项目使用了redux-thunk来处理异步请求，redux-thunk最重要的思想，就是可以接受一个返回函数的action creator。如果这个action creator 返回的是一个函数，就执行它，如果不是，就按照原来的next(action)执行。
正因为这个action creator可以返回一个函数，那么就可以在这个函数中执行一些异步的操作。
[参考](https://www.jianshu.com/p/a27ab19d3657)
详细示例可参考 项目的tag login_pro_v1.0
```
//src/views/login/index.js
const mapDispatchToProps = {
  loginUser: appAction.loginUser,
};
```
## ajax设计
项目通过两方面来封装 ajax：
- 通过api.js 封装三个常用的ajax方法 post、get、delete，在此js上，主要封装axios相关。
- 通过createAsyncAction.js 抽象出 公共的请求的成功和异常处理。
这样的设计好处在于
可以将axios与 回调处理的代码分离管理，减少耦合性。
详细示例可参考 项目的tag login_pro_v1.0
```
//src/views/login/index.js
const mapDispatchToProps = {
  loginUser: appAction.loginUser,
};
```
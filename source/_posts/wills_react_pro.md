---
title: wills-react-pro搭建笔记
date: {{ date }}
tags: [react, webpack, jest, enzyme, mock, koa, react-redux, redux]
categories: 
- 前端工程
series: 前端工程
---

# 要做的事情

jest Enzyme
hot-loader
js-source map
js源码调试
css-source map
mock
跨域请求 koa
嵌套路由
全局路由
ajax封装
connect封装
reducer封装
action封装
路由封装
异步action

# 项目开发计划
写一个简单的html，配合webpack 跑起来；
集成 react
集成 路由 redux
集成mock
集成jest
webpack的深入配置放在最后

初步想法是，将掘金小册的demo整理过来

# 想法
## ajax封装

### 什么时候需要success提示
ajax分为两种：
一种是进入页面请求数据渲染页面的，此时不需要提示接口响应成功，只需loading即可。
一种是与后台交互，需要响应结果的，如交易、删除、编辑等，提交到后台，后台告知是否成功。
因此在做ajax封装时，可以不用配置success 的提示处理，需要提示的接口自行配置success提示处理。
### 什么时候需要loading
原则上每个请求都应该有loading，但是有很多组件有自己的loading样式，例如在非刷新整个页面的情况下，组件内刷新gird，只需在grid内显示loading，不需要统一的loading格式。
因此ajax封装时，配置可选的 loading标识是否loading。
### 什么时候需要error提示
ajax封装需要封装请求异常处理并提示，统一的异常处理和提示应该放在最后，为了不同接口个性化errorhandle，配置errorhandle，优先级高于统一处理模式。
### 断网时、请求超时的的error提示
断网和请求响应超时时，应该统一处理，并优先级最高。
### 使用options
loading，errorhandle等等，有很多参数，使用一个对象参数options。


# v0.01
## 版本介绍
此版本是一个最简单的工程配置版本，指包含一个简单界面和项目最基本的html js css webpack处理。

## 如何开始从0启动一个webpack项目
### 注重 webpack 入口 ：
```
"scripts": {
    "start": "webpack-dev-server --config webpack.dev.js"
  },
```
### 项目最基本配置：
一个项目无非围绕 html，css，js，图片，axios进行，因此对应的配置如下，本版本下的package.json配置的依赖都是基于以下最基本的配置：
#### html
html模版插件
#### css
scss、css、图片 loader
css、图片与html分离
css3加兼容性前缀
#### js
es6、es7编译成es5
es6、es7的api(如Promise等等)运行profill
一些es6等相关的babel js插件
#### webpack
#### axios
#### 小结
webpack无非就是对html css js 图片文件的打包，因为又多了babel对js的打包，可以说工程项目中对js的打包是最丰富的。

## 想法backup

react前端工程项目

工程项目分几个阶段
先起一个简单页面
首先搞定webpack
- 基础配置
- 代码模块分割
- eslint配置
- jest配置
- hot reloader
逐渐展开

方案历程：
刚开始着手做项目，无从开始
先从配置webpack开始，
先写一个简单页面，
将上面配置写好后
然后再深入前端技术栈
redux 封装
ajax 封装
router 封装
懒加载
预加载
明天先参照 之前写的webpack-code项目，配置基础的，并做笔记。
目前的想法是，先写一个简单的页面，不考虑react技术的页面，让webpack运行起来，
然后按上面的步骤，展开。

前期不考虑使用koa进行中转；
前期先做不考虑跨域问题的配置工程；

## eslint
### 禁用规则
基本上所有的规则都可以通过设置 值为 0的数组来禁用。
```
"no-unused-expressions": [0]
```

## jest
### mock的用法
示例见 [wills-react-pro 的 Login.test.js](https://github.com/YeWills/wills-react-pro)
```
 const mockPost = jest.fn(testPost({ success: false }));
```

## enzyme
### shallow的两种情况
shallow一个组件时，和shallow组件内一个返回div的函数用法稍微有区别，
前者需要通过’<>‘括号起来，后者不需要。
示例见 [wills-react-pro 的 Login.test.js](https://github.com/YeWills/wills-react-pro)
#### shallow一个组件
这种情况最通用，不多说：
```
shallow(<Login />);
```

#### shallow组件内的函数返回的div

```
renderErrorMsg = () => {
    return (
        <div className={`${prefixCls}-errorMsg`}>
          {errorMsg}
        </div>
      );
  };

  //测试代码如下：
  const ErrorComponent = warpInstance.renderErrorMsg();
  const errorWrap = shallow(ErrorComponent);
  expect(errorWrap.exists('.view-login-errorMsg')).toBeTruthy();
```


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

## 技术栈
### connected-react-router 与 history
这是一种固定写法，不用过多关注：
```
//参考 项目的tag login_pro_v1.0
//src/app/init/createStore.js
import { connectRouter, routerMiddleware } from 'connected-react-router';

connectRouter(history)(combineReducers(reducers)),
```

### 路由设计
#### ConnectedRouter配置
ConnectedRouter类似BrowserRouter。MultiIntlProvider可以不用管就是一个高阶组件。

```
<ConnectedRouter history={history}>
    <MultiIntlProvider defaultLocale={locale} messageMap={messages} >
        <Switch>
            <Route key={path} path="/dashboard/analysis/realtime" component={Page} />
        </Switch>
    </MultiIntlProvider>
 </ConnectedRouter>
```
#### 使用BrowserRouter
项目的具体布局主要看 src/src-acl-router/AclRouter.jsx;
本项目应该用的是BrowserRouter，而非HashRouter，因为页面的路由都没有#。
整理出来如下：
```
<BrowserRouter history={history}>
    <Switch>
        <Route key={path} path="/realtime" render={Page} />
        <Route key={path} path="/realtime" render={Page} />
        <Route render={props => (<NotFound {...props} />)}/>
    </Switch>
 </BrowserRouter>
```
注意上面的NotFound页面的路由设计挺好，此路由没有配置path，当上面的路由都未匹配时，就顺延到NotFound页面。